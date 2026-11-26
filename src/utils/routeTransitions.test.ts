import test from 'node:test';
import assert from 'node:assert/strict';
import { getRouteShellKey, getRouteTransitionSpec } from './routeTransitions';

test('getRouteShellKey maps top-level shells and groups main app routes together', () => {
  assert.equal(getRouteShellKey('/'), 'landing');
  assert.equal(getRouteShellKey('/auth'), 'auth');
  assert.equal(getRouteShellKey('/admin'), 'admin');
  assert.equal(getRouteShellKey('/dashboard'), 'app');
  assert.equal(getRouteShellKey('/discover'), 'app');
  assert.equal(getRouteShellKey('/communities'), 'app');
  assert.equal(getRouteShellKey('/communities/comm-overthinkers'), 'app');
  assert.equal(getRouteShellKey('/journal'), 'app');
  assert.equal(getRouteShellKey('/unknown-route'), 'landing');
});

test('getRouteTransitionSpec returns horizontal drill-in/back for community details', () => {
  assert.deepEqual(
    getRouteTransitionSpec('/communities', '/communities/comm-college-survival'),
    { axis: 'x', direction: 1 }
  );
  assert.deepEqual(
    getRouteTransitionSpec('/communities/comm-college-survival', '/communities'),
    { axis: 'x', direction: -1 }
  );
});

test('getRouteTransitionSpec returns vertical direction matching sidebar navigation order', () => {
  assert.deepEqual(getRouteTransitionSpec('/dashboard', '/discover'), {
    axis: 'y',
    direction: 1,
  });
  assert.deepEqual(getRouteTransitionSpec('/journal', '/dashboard'), {
    axis: 'y',
    direction: -1,
  });
  assert.deepEqual(getRouteTransitionSpec('/same-here', '/mood-tracker'), {
    axis: 'y',
    direction: 1,
  });
  assert.deepEqual(getRouteTransitionSpec('/mood-tracker', '/real-talk'), {
    axis: 'y',
    direction: -1,
  });
});
