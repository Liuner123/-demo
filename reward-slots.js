(function () {
  var lists = {};
  var lastStates = {};
  var columnsByDifficulty = { '英雄': [1, 3], '炼狱': [1, 2, 3], '折磨': [0, 1, 2, 3, 4] };

  function setup(pageId) {
    if (lists[pageId] && lists[pageId].isConnected) return lists[pageId];
    var page = document.getElementById(pageId);
    if (!page) return null;
    var area = Array.from(page.firstElementChild.children).find(function (element) {
      return element.style.top === '1168px' && /循环奖励|必掉奖励/.test(element.textContent);
    });
    if (!area) return null;
    area.classList.add('war-reward-area');
    var oldList = Array.from(area.children).find(function (element) {
      return element.style.top === '51.5px' || element.style.top === '51.50px';
    });
    if (oldList) oldList.classList.add('war-reward-old-list');
    Array.from(area.children).forEach(function (element) {
      if (element.textContent.indexOf('循环奖励获取次数') !== -1 || element.style.left === '977px') {
        element.remove();
      }
    });
    area.querySelectorAll('span').forEach(function (text) {
      if (text.textContent.trim() === '循环奖励') text.textContent = '必掉奖励';
    });
    var list = document.createElement('div');
    list.className = 'war-reward-slots';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', pageId === 'page-plan' ? '已选节点奖励' : '已保存计划必掉奖励');
    area.appendChild(list);
    lists[pageId] = list;
    lastStates[pageId] = '';
    return list;
  }

  function renderSlots(pageId, data, difficulty) {
    var list = setup(pageId);
    if (!list) return;
    var columns = data && Array.isArray(data.activeCols) ? data.activeCols : columnsByDifficulty[difficulty] || [];
    var selected = data && data.selected || [];
    var order = [];
    var storedOrder = data && Array.isArray(data.selectionOrder) ? data.selectionOrder : [];
    storedOrder.concat(columns).forEach(function (column) {
      if (columns.indexOf(column) !== -1 && selected[column] != null && order.indexOf(column) === -1) {
        order.push(column);
      }
    });
    var count = pageId === 'page-plan' ? columns.length : data ? order.length : 0;
    var state = JSON.stringify({ columns: columns, order: order, selected: selected, count: count });
    if (lastStates[pageId] === state) return;
    lastStates[pageId] = state;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var slot = document.createElement('div');
      slot.className = 'war-reward-slot';
      var image = document.createElement('img');
      image.width = 160;
      image.height = 160;
      image.draggable = false;
      if (i < order.length) {
        slot.classList.add('is-filled');
        slot.dataset.col = order[i];
        slot.dataset.row = selected[order[i]];
        image.src = 'assets/CodeBuddyAssets/11790_807263/1.png';
        image.alt = '第' + (i + 1) + '份奖励';
      } else {
        image.src = 'assets/CodeBuddyAssets/11790_807266/1.png';
        image.alt = '第' + (i + 1) + '个空奖励槽';
      }
      slot.appendChild(image);
      fragment.appendChild(slot);
    }
    list.replaceChildren(fragment);
  }

  function sync() {
    var difficulty = window.getWarDifficulty ? window.getWarDifficulty() : '折磨';
    var editorData = window.getWarPlanSnapshot ? window.getWarPlanSnapshot() : null;
    renderSlots('page-plan', editorData, editorData && editorData.difficulty || difficulty);
    var savedData = window.getStoredWarPlan ? window.getStoredWarPlan(difficulty) : null;
    renderSlots('page-empty', savedData, difficulty);
  }

  var observer = new MutationObserver(sync);
  function observeHome() {
    var home = document.getElementById('page-empty');
    if (home) observer.observe(home, { childList: true, attributes: true, attributeFilter: ['class'] });
  }

  window.syncWarRewardSlots = sync;
  sync();
  observeHome();
  window.addEventListener('pagehide', function () { observer.disconnect(); });
  window.addEventListener('pageshow', function () {
    observeHome();
    sync();
  });
})();
