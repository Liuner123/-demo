(function () {
  function decorate(node) {
    if (node.classList.contains('is-hidden') || node.querySelector('.war-node-visual')) return;

    var visual = document.createElement('div');
    visual.className = 'war-node-visual';
    var reward = document.createElement('div');
    reward.className = 'war-node-reward';
    var quality = document.createElement('img');
    quality.className = 'war-reward-quality';
    quality.src = 'assets/rewards/quality-' + node.dataset.rewardQuality + '.png';
    quality.alt = '';
    var image = document.createElement('img');
    image.className = 'war-reward-icon';
    image.src = 'assets/rewards/icon-' + node.dataset.rewardIcon + '.png';
    image.alt = '奖励图标 ' + node.dataset.rewardIcon;
    reward.setAttribute('aria-label', '奖励品质 ' + node.dataset.rewardQuality);
    reward.appendChild(quality);
    reward.appendChild(image);
    visual.appendChild(reward);

    var icon = node.querySelector('.war-icon');
    if (!icon && window.createWarNodeIcon && node.dataset.icon) {
      visual.insertAdjacentHTML('beforeend', window.createWarNodeIcon(node.dataset.icon));
    } else if (icon) {
      visual.appendChild(icon);
    }

    var ring = document.createElement('span');
    ring.className = 'war-node-focus-ring';
    ring.setAttribute('aria-hidden', 'true');
    visual.appendChild(ring);

    if (node.classList.contains('war-node')) {
      var selectable = document.createElement('span');
      selectable.className = 'war-selectable-hint';
      selectable.setAttribute('aria-hidden', 'true');
      for (var corner = 1; corner <= 4; corner++) {
        var triangle = document.createElement('span');
        triangle.className = 'war-selectable-corner war-selectable-corner-' + corner;
        var triangleImage = document.createElement('img');
        triangleImage.src = 'assets/CodeBuddyAssets/11790_1351362/1.png';
        triangleImage.alt = '';
        triangleImage.draggable = false;
        triangle.appendChild(triangleImage);
        selectable.appendChild(triangle);
      }
      visual.appendChild(selectable);
    }

    var current = document.createElement('span');
    current.className = 'war-current-effects';
    current.setAttribute('aria-hidden', 'true');
    var currentImage = document.createElement('img');
    currentImage.className = 'war-current-art';
    currentImage.src = 'assets/CodeBuddyAssets/11790_1351231/1.png';
    currentImage.alt = '';
    currentImage.draggable = false;
    current.appendChild(currentImage);
    ['11790_1351237', '11790_1351240'].forEach(function (asset, index) {
      var orbit = document.createElement('span');
      orbit.className = 'war-current-orbit war-current-orbit-' + (index + 1);
      var orbitImage = document.createElement('img');
      orbitImage.className = 'war-current-orbit-image';
      orbitImage.src = 'assets/CodeBuddyAssets/' + asset + '/1.png';
      orbitImage.alt = '';
      orbitImage.draggable = false;
      orbit.appendChild(orbitImage);
      current.appendChild(orbit);
    });
    visual.appendChild(current);
    node.appendChild(visual);
  }

  function setupEditor() {
    var page = document.getElementById('page-plan');
    if (!page) return;
    var canvas = page.firstElementChild;
    Array.from(canvas.children).forEach(function (element) {
      if (element.style.top === '201px' && element.textContent.indexOf('作战计划') !== -1) {
        element.classList.add('war-editor-old-heading');
      }
      if (parseFloat(element.style.top) >= 1000) {
        element.classList.add('war-editor-bottom');
      }
    });
    if (page.querySelector('.war-editor-intro')) return;
    var intro = document.createElement('section');
    intro.className = 'war-editor-intro';
    var title = document.createElement('h2');
    title.textContent = '作战计划';
    var description = document.createElement('p');
    description.textContent = '从左往右逐层选择有连线的节点，双击可快速选择；回改节点将清空右侧选择。';
    intro.appendChild(title);
    intro.appendChild(description);
    page.appendChild(intro);
  }

  function setupHome() {
    var page = document.getElementById('page-empty');
    if (!page) return;
    Array.from(page.firstElementChild.children).forEach(function (element) {
      if (element.style.top === '201px' && element.style.width === '1923px') {
        element.classList.add('war-home-old-heading');
      }
      if (parseFloat(element.style.top) >= 1000) {
        element.classList.add('war-home-bottom');
      }
      if (element.style.width === '536px' && element.style.height === '96px') {
        element.classList.add('war-home-make-plan');
      }
    });
    if (page.querySelector('.war-home-intro')) return;
    var intro = document.createElement('section');
    intro.className = 'war-home-intro';
    var title = document.createElement('h2');
    title.textContent = '作战计划';
    var description = document.createElement('p');
    description.textContent = '暂无作战计划';
    intro.appendChild(title);
    intro.appendChild(description);
    var editText = Array.from(page.querySelectorAll('span')).find(function (span) {
      return span.textContent.trim() === '编辑';
    });
    var edit = editText && editText.parentElement;
    while (edit && edit !== page) {
      if (edit.style.width === '174px' && edit.style.height === '64px') {
        edit.classList.add('war-home-edit');
        edit.setAttribute('role', 'button');
        edit.setAttribute('aria-label', '编辑作战计划');
        edit.tabIndex = 0;
        var editImage = document.createElement('img');
        editImage.className = 'war-home-edit-image';
        editImage.src = 'assets/CodeBuddyAssets/11790_1350893/1.png';
        editImage.alt = '';
        editImage.draggable = false;
        edit.appendChild(editImage);
        edit.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
          }
        });
        intro.appendChild(edit);
        break;
      }
      edit = edit.parentElement;
    }
    page.appendChild(intro);
  }

  function editorCenter(column, row, offset) {
    return { x: 110 + column * 320 + offset, y: 130 + row * 200 + (column === 4 && row === 0 ? 80 : 0) };
  }

  function layoutBoard(board) {
    if (!board) return;
    var data = board.id === 'war-plan-board' && window.getWarPlanSnapshot ? window.getWarPlanSnapshot() : null;
    var difficulty = data ? data.difficulty : window.getWarDifficulty();
    var offset = difficulty === '英雄' ? 160 : 0;
    board.style.left = '512px';
    board.style.top = '138px';
    board.querySelectorAll('.war-node, .war-result-node').forEach(function (node) {
      var center = editorCenter(+node.dataset.col, +node.dataset.row, offset);
      node.style.left = (center.x - 107.1) + 'px';
      node.style.top = (center.y - 50.4) + 'px';
    });
    board.querySelectorAll('.war-edge, .war-result-edge').forEach(function (edge) {
      var key = edge.dataset.key.split('-').map(Number);
      var start = editorCenter(key[0], key[2], offset);
      var end = editorCenter(key[1], key[3], offset);
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      edge.style.left = start.x + 'px';
      edge.style.top = start.y + 'px';
      edge.style.width = Math.hypot(dx, dy) + 'px';
      edge.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
    });
  }

  function sync() {
    setupEditor();
    setupHome();
    layoutBoard(document.getElementById('war-plan-board'));
    layoutBoard(document.getElementById('war-result-board'));
    document.querySelectorAll('#war-plan-board .war-node, #war-result-board .war-result-node').forEach(decorate);
  }

  var observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
  sync();
  window.addEventListener('pagehide', function () { observer.disconnect(); });
  window.addEventListener('pageshow', function () {
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
  });
})();
