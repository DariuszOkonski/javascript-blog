{
  ('use strict');

  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';
  const optArticleTagsSelector = '.post-tags .list';
  const optArticleAuthorSelector = '.post .post-author a';
  const optTagsListSelector = '.tags.list';
  const optCloudClassCount = 5;
  const optCloudClassPrefix  = 'tag-size-';


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

  const calculateTagsParams = function(tags) {
    const params = {
      max: 0,
      min: 999999
    };

    for (const item in tags) {
      if(tags[item] > params.max){
        params.max = tags[item];
      }
      if(tags[item] < params.min) {
        params.min = tags[item];
      }
    }

    return params;
  };

  const calculateTagClass = function(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

    return optCloudClassPrefix + classNumber;
  };

  const generateTags = function () {
    let allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);

    for (const article of articles) {
      let html = '';
      const articleTagsSelector = article.querySelector(optArticleTagsSelector);
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (const tag of articleTagsArray) {
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        html += linkHTML;

        if(!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      articleTagsSelector.innerHTML = html;
    }
    
    const tagList = document.querySelector(optTagsListSelector);

    const tagsParams = calculateTagsParams(allTags);

    let allTagsHTML = '';
  
    for (const tag in allTags) {
      allTagsHTML += '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">'+ tag + ' (' + allTags[tag] + ') ' +'</a></li>';
    }

    tagList.innerHTML = allTagsHTML;
  };

  const generateAuthors = function() {
    const articles = document.querySelectorAll(optArticleSelector);

    for (const article of articles) {
      const author = article.getAttribute('data-author');
      const anchor = '<a href="#">' + author + '</a>';
      const postAuthor = article.querySelector('.post-author');
      postAuthor.innerHTML = anchor;
    }
  };

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
  
  const authorClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    const author = clickedElement.textContent;

    generateTitleLinks('[data-author="'+ author + '"]');
  };

  const addClickListenersToAuthors = function() {
    const authorLinks = document.querySelectorAll(optArticleAuthorSelector);

    for (const author of authorLinks) {
      author.addEventListener('click', authorClickHandler);
    }
  };

  generateTitleLinks();
  generateTags();
  generateAuthors();

  addClickListenersToTags();
  addClickListenersToAuthors();
}
