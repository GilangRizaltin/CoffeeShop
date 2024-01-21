class Response {
    constructor(message, data, meta) {
      this.message = message;
      this.data = data;
      this.meta = meta;
    }
  }
  
  class Meta {
    constructor(page, nextPage, prevPage, totalData, totalPage) {
      this.page = page;
      this.nextPage = nextPage;
      this.prevPage = prevPage;
      this.totalData = totalData;
      this.totalPage = totalPage;
    }
  }
  
  function getPagination(url, totalData, page, limit) {
    let nextPage, prevPage;

    // const urlFull = `${ctx.request.host}${ctx.request.url}`;
    // const url = urlFull.split('?')[1];
    // const pages = page !== 0 ? page : 1;

    nextPage = `${url.slice(0, -1) + 1}`;
    prevPage = `${url.slice(0, -1) - 1}`;
    const lastPage = Math.ceil(totalData[0] / limit);
  
    // if (page === 0) {
    //   nextPage = `${url}&page=${pages + 1}`;
    //   prevPage = null;
    //   if (pages === lastPage) {
    //     nextPage = null;
    //   }
    // }
  
    if (page === lastPage) {
      nextPage = null;
    }
  
    if (page === 1) {
      prevPage = null;
    }
  
    return new Meta(page, nextPage, prevPage, totalData, lastPage);
  }
  
  function newResponse(message, data, meta) {
    return new Response(message, data, meta);
  }

  module.exports = {getPagination, newResponse};
  