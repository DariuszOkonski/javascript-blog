{
  ('use strict');

  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';
  const optArticleTagsSelector = '.post-tags .list';

  const titleClickHandler = function (event) {
    event.preventDefault();

    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');
    for (const activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts .active');
    for (const activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');

    const targetArticle = document.querySelector('.posts ' + articleSelector);

    targetArticle.classList.add('active');
  };

  const generateTitleLinks = function (customSelector  = '') {
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

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

  const generateTags = function () {
    const articles = document.querySelectorAll(optArticleSelector);

    for (const article of articles) {
      let html = '';
      const articleTagsSelector = article.querySelector(optArticleTagsSelector);
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (const tag of articleTagsArray) {
        html += '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      }

      articleTagsSelector.innerHTML = html;
    }
  };

  generateTags();

  const generateAuthors = function() {
    const articles = document.querySelectorAll(optArticleSelector);

    for (const article of articles) {
      const author = article.getAttribute('data-author');
      const anchor = '<a href="#">' + author + '</a>';
      const postAuthor = article.querySelector('.post-author');
      postAuthor.innerHTML = anchor;
    }
  };

  generateAuthors();

  const tagClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    
    const activeTagLinks = document.querySelectorAll(optArticleTagsSelector + ' a.active[href^="#tag-"]');

    for (const activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }

    const clickedTagLinks = document.querySelectorAll('a[href="'+ href +'"]');

    for (const tagLink of clickedTagLinks) {
      tagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="'+ tag + '"]');
  };
  
  const addClickListenersToTags = function(){
    const tags = document.querySelectorAll(optArticleTagsSelector + ' a');

    for (const tag of tags) {
      tag.addEventListener('click', tagClickHandler);
    }
  };
  
  addClickListenersToTags();
}
