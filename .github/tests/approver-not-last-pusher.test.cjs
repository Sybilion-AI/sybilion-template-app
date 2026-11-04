const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const workflow = fs.readFileSync(path.join(__dirname, '../workflows/approver-not-last-pusher.yml'), 'utf8');
const block = workflow.split('          script: |\n')[1];
assert.ok(block, 'workflow script block exists');
const script = block.split('\n').map(line => line.startsWith('            ') ? line.slice(12) : line).join('\n');
new vm.Script(`(async () => { ${script} })()`);

async function evaluate({reviews, runs, action = 'submitted', actor = 'reviewer', author = 'author'}) {
  const calls = [];
  const github = {
    rest: {
      pulls: { listReviews() {} },
      actions: { listWorkflowRunsForRepo() {} },
      checks: { listForRef() {}, create: async input => calls.push(input), update: async input => calls.push(input) }
    },
    paginate: async (method) => {
      if (method === github.rest.pulls.listReviews) return reviews;
      if (method === github.rest.actions.listWorkflowRunsForRepo) return runs;
      if (method === github.rest.checks.listForRef) return [];
      throw Error('unexpected paginated method');
    }
  };
  const context = {
    repo: { owner: 'Sybilion-AI', repo: 'prefect-cluster' },
    actor, eventName: action === 'submitted' ? 'pull_request_review' : 'pull_request',
    payload: { action, pull_request: { number: 34, head: { sha: 'head-sha', ref: 'feature' }, user: { login: author } } }
  };
  await vm.runInNewContext(`(async () => { ${script} })()`, {
    context, github, core: { info() {} }, process: { env: { EXCLUDED_APPROVERS: 'nunobarrosmir,sybilion-agents' } }
  });
  assert.equal(calls.length, 1);
  return calls[0];
}

const review = (login, state = 'APPROVED', id = 1, type = 'User') =>
  ({ id, state, user: { login, type } });
const run = (login, id = 1) =>
  ({ id, event: 'pull_request', head_sha: 'head-sha', head_branch: 'feature', actor: { login }, pull_requests: [], created_at: '2026-11-03T10:29:02Z', html_url: `https://github.com/runs/${id}` });

test('fails when the only human approver pushed the head merge', async () => {
  const result = await evaluate({ reviews: [review('spock0')], runs: [run('spock0')] });
  assert.equal(result.conclusion, 'failure');
  assert.match(result.output.summary, /Head pusher: spock0/);
});

test('passes when another human approval stands', async () => {
  const result = await evaluate({ reviews: [review('spock0'), review('gilfoyle', 'APPROVED', 2)], runs: [run('spock0')] });
  assert.equal(result.conclusion, 'success');
});

test('neutral when approvals are absent, dismissed, bots, author or shared accounts', async () => {
  const result = await evaluate({
    reviews: [review('spock0'), review('spock0', 'DISMISSED', 2), review('cursor', 'APPROVED', 3, 'Bot'),
      review('author', 'APPROVED', 4), review('nunobarrosmir', 'APPROVED', 5)],
    runs: [run('spock0')]
  });
  assert.equal(result.conclusion, 'neutral');
  assert.match(result.output.summary, /Qualifying approvers: none/);
});

test('uses the run actor, not an agent commit author or review event actor', async () => {
  const result = await evaluate({ reviews: [review('gilfoyle')], runs: [run('gilfoyle')], actor: 'spock0' });
  assert.equal(result.conclusion, 'failure');
});

test('fails safely if no run establishes a pusher', async () => {
  const result = await evaluate({ reviews: [review('gilfoyle')], runs: [] });
  assert.equal(result.conclusion, 'failure');
  assert.match(result.output.summary, /Head pusher: unknown/);
});
