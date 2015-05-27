ajaxRequest.get('/api/search.json', {query: ''}, function (err, ret) {
  if (err) return messageBox.error(err);
  renderTplPackages.to('#packages', ret);
});

