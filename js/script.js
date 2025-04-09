{
  ('use strict');

  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';

  const titleClickHandler = function (event) {
    event.preventDefault();

    const clickedElement = this;
    console.log('Link was clicked!');

    const activeLinks = document.querySelectorAll('.titles a.active');
    for (const activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    console.log('clickedElement: ', clickedElement);

    const activeArticles = document.querySelectorAll('.posts .active');
    for (const activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');

    const targetArticle = document.querySelector('.posts ' + articleSelector);

    targetArticle.classList.add('active');
  };

  const generateTitleLinks = function () {
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    const articles = document.querySelectorAll(optArticleSelector);

    let html = '';
    for (const article of articles) {
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      const linkHTML =
        '<li><a href="#' +
        articleId +
        '"><span>' +
        articleTitle +
        '</span></a></li>';

      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (const link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();
}
