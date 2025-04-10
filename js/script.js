{
  ('use strict');

  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    articleBottomTag: Handlebars.compile(
      document.querySelector('#template-article-bottom-tag').innerHTML
    ),
    articleAuthor: Handlebars.compile(
      document.querySelector('#template-article-author-link').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    tagAuthorLink: Handlebars.compile(
      document.querySelector('#template-tag-author-link').innerHTML
    ),
  };

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post .post-author a',
    tagsListSelector: '.tags.list',
    authorsListSelector: '.list.authors',
  };

  const optCloudClassCount = 5;
  const optCloudClassPrefix = 'tag-size-';

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

  const generateTitleLinks = function (customSelector = '') {
    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = '';

    const articles = document.querySelectorAll(
      opts.articleSelector + customSelector
    );

    let html = '';
    for (const article of articles) {
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      html += linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (const link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  const calculateTagsParams = function (tags) {
    const params = {
      max: 0,
      min: 999999,
    };

    for (const item in tags) {
      if (tags[item] > params.max) {
        params.max = tags[item];
      }
      if (tags[item] < params.min) {
        params.min = tags[item];
      }
    }

    return params;
  };

  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

    return optCloudClassPrefix + classNumber;
  };

  const generateTags = function () {
    let allTags = {};
    const articles = document.querySelectorAll(opts.articleSelector);

    for (const article of articles) {
      let html = '';
      const articleTagsSelector = article.querySelector(
        opts.articleTagsSelector
      );
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (const tag of articleTagsArray) {
        const linkHTMLData = { id: tag, title: tag };
        const linkHTML = templates.articleBottomTag(linkHTMLData);
        html += linkHTML;

        if (!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      articleTagsSelector.innerHTML = html;
    }

    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);

    const allTagsData = { tags: [] };

    for (const tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  };

  const generateAuthors = function () {
    const articles = document.querySelectorAll(opts.articleSelector);
    const authors = {};

    for (const article of articles) {
      const author = article.getAttribute('data-author');
      const postAuthor = article.querySelector('.post-author');

      const linkHTMLData = { author };
      const linkHTML = templates.articleAuthor(linkHTMLData);
      postAuthor.innerHTML = linkHTML;

      if (!authors[author]) {
        authors[author] = 1;
      } else {
        authors[author]++;
      }
    }

    const allTagsData = { tags: [] };
    for (const author in authors) {
      allTagsData.tags.push({
        author: author,
        count: authors[author],
      });
    }

    const authorsListSelector = document.querySelector(
      opts.authorsListSelector
    );

    authorsListSelector.innerHTML = templates.tagAuthorLink(allTagsData);
  };

  const tagClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const activeTagLinks = document.querySelectorAll(
      opts.articleTagsSelector + ' a.active[href^="#tag-"]'
    );

    for (const activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }

    const clickedTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    for (const tagLink of clickedTagLinks) {
      tagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function () {
    const tags = document.querySelectorAll(opts.articleTagsSelector + ' a');

    for (const tag of tags) {
      tag.addEventListener('click', tagClickHandler);
    }
  };

  const authorClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    const author = clickedElement.textContent;

    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function () {
    const authorLinks = document.querySelectorAll(opts.articleAuthorSelector);

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
