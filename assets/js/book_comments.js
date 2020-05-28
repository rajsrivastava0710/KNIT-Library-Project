{   
    // method to submit the form data for new post using AJAX
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');

        newCommentForm.submit(function(e){
            e.preventDefault();
            let _url = $(this).attr('action');
            $.ajax({
                type: 'post',
                url: _url,
                data: newCommentForm.serialize(),//convert form data into json
                success: function(data){
                    $('#new-comment-form input').val('');
                    let newComment = newCommentDom(data.data.comment);
                    $('#comment-container>ul').prepend(newComment);
                    deletePost($(' .delete-comment-btn', newComment));
                        
                        //remember the space before class name
                        //class inside the newPost - jquery method

                    new Noty({
                        theme:'relax',
                        text: "New Comment Created successfully !",
                        type:'success',
                        layout:'topCenter',
                        timeout: 1500,
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


//     // method to create a post in DOM
    let newCommentDom = function(comment){
        return $(`
                <li id='comment-${comment._id}'><a class='delete-comment-btn' href='/library/book/${comment.book}/comment/${comment._id}/destroy'>X</a> ${comment.content} : ${comment.user.name} <br>
                <small>Just now</small>
                </li> 
            `)
    }   


//     // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).attr('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text: "Comment deleted successfully !",
                        type:'success',
                        layout:'topCenter',
                        timeout: 1500,
                    }).show();
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }


    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertCommentsToAjax = function(){
        $('#comment-container>ul>li').each(function(){
            let self = $(this);
            deletePost($(' .delete-comment-btn', self));
        });
    }

    createComment();
    convertCommentsToAjax();
}