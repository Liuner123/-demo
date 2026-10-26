(function () {
  var labels = ['普通', '困难', '英雄', '炼狱', '折磨', '秘境'];
  var columns = {
    '普通': [1, 3],
    '困难': [1, 2, 3],
    '英雄': [0, 1, 2, 3],
    '炼狱': [0, 1, 2, 3, 4],
    '折磨': [0, 1, 2, 3, 4],
    '秘境': [0, 1, 2, 3, 4]
  };

  function normalize(label) {
    return labels.indexOf(label) !== -1 ? label : '普通';
  }

  function buildMenu(page, onSelect) {
    var oldTab = Array.from(page.querySelectorAll('div')).find(function (element) {
      return element.style.width === '231px' && element.style.height === '126px';
    });
    if (!oldTab) return [];
    var menu = oldTab.parentElement;
    menu.classList.add('war-difficulty-menu');
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', '难度，从简单到难');
    var tabs = labels.map(function (label) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'war-difficulty-tab';
      button.dataset.difficulty = label;
      button.textContent = label;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () { onSelect(label); });
      return button;
    });
    menu.replaceChildren.apply(menu, tabs);
    return tabs;
  }

  window.warDifficultyConfig = {
    labels: labels,
    columns: columns,
    normalize: normalize,
    buildMenu: buildMenu
  };
})();
