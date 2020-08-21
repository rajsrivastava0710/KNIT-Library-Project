const pastBooks = $('.past-book-details');
const pastText = $('#past-books-container div:first-of-type span').eq(0);
const issueBooks = $('.issue-book-details');
const issueText = $('#issued-books-container div:first-of-type span').eq(0);

pastText.on('click',function(e){
	pastBooks.fadeToggle(500);
})
issueText.on('click',function(e){
	issueBooks.fadeToggle(500);
})

console.log(issueText,pastText)