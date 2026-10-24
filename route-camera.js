(function () {
  var active = null;
  var zoom = 1.3;

  function release(state) {
    state.node.classList.remove('is-camera-focused');
    state.page.classList.remove('has-route-camera');
    state.board.style.transform = '';
    state.background.style.transform = '';
  }

  function reset() {
    if (active) release(active);
    active = null;
    var tip = document.getElementById('war-tip-layer');
    if (tip) tip.classList.remove('is-camera-tip');
  }

  function focus(node) {
    if (!node.isConnected || node.classList.contains('is-hidden')) return;
    var board = node.closest('#war-plan-board, #war-result-board');
    var page = node.closest('.page');
    if (!board || !page || page.hidden) return;
    var background = page.firstElementChild.querySelector('img');
    if (!background) return;
    if (active) {
      active.node.classList.remove('is-camera-focused');
      if (active.page !== page || active.board !== board) release(active);
    }

    var style = getComputedStyle(board);
    var nodeStyle = getComputedStyle(node);
    var left = parseFloat(style.left) || 0;
    var top = parseFloat(style.top) || 0;
    var x = left + (parseFloat(node.style.left) || 0) + parseFloat(nodeStyle.width) / 2;
    var y = top + (parseFloat(node.style.top) || 0) + parseFloat(nodeStyle.height) / 2;
    var dx = 896 - zoom * x;
    var dy = 720 - zoom * y;

    background.classList.add('route-camera-background');
    board.classList.add('route-camera-board');
    page.classList.add('has-route-camera');
    node.classList.add('is-camera-focused');
    board.style.transform = 'translate(' + (dx + (zoom - 1) * left) + 'px,' + (dy + (zoom - 1) * top) + 'px) scale(' + zoom + ')';
    var backgroundX = Math.max(-2560 * (zoom - 1), Math.min(0, dx));
    var backgroundY = Math.max(-1440 * (zoom - 1), Math.min(0, dy));
    background.style.transform = 'translate(' + backgroundX + 'px,' + backgroundY + 'px) scale(' + zoom + ')';
    active = { page: page, board: board, background: background, node: node };
    var tip = document.getElementById('war-tip-layer');
    if (tip) tip.classList.add('is-camera-tip');
  }

  window.warRouteCamera = { focus: focus, reset: reset };

  document.addEventListener('dblclick', function (event) {
    if (!event.target.closest('.war-node, .war-result-node')) return;
    reset();
  }, true);

  document.addEventListener('click', function (event) {
    if (!active || event.target.closest('.war-node, .war-result-node, .war-tip-panel')) return;
    var tip = document.getElementById('war-tip-layer');
    if (tip) tip.hidden = true;
    reset();
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !active) return;
    var tip = document.getElementById('war-tip-layer');
    if (tip) tip.hidden = true;
    if (window.clearWarNodeFocus) window.clearWarNodeFocus();
    reset();
  });

  var observer = new MutationObserver(function () {
    if (!active) return;
    var tip = document.getElementById('war-tip-layer');
    if (active.page.hidden || !active.node.isConnected || active.node.classList.contains('is-hidden') || !tip || tip.hidden) reset();
  });
  function observe() {
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }
  observe();
  window.addEventListener('pagehide', function () {
    reset();
    observer.disconnect();
  });
  window.addEventListener('pageshow', observe);
})();
