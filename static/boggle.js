const $guessForm = $('#guess-form');

$guessForm.on('submit', async function(e){
    // handle form submission

    // prevent page refresh upon form submission
    e.preventDefault();
    
    // send word to server to see if it's a valid word in the dictionary / on board
    const userGuess = $('#user-guess').val();
    
    // if user submits form without entering, any input, display message and return
    // show message to user based on response received from server 
    let $msg = $('.msg');
    if (userGuess == ''){
        $msg.replaceWith ('<p id ="empty-msg" class="msg"> Invalid. Please enter a word. </p>');
        $msg = $('.msg');
        return;
    }

    const response = await axios({
        method: 'post',
        url: '/check-word',
        data:{userGuess: userGuess}
    });

    result = response.data['result'];

    if(result == 'ok'){
        $msg.replaceWith ('<p id="ok-msg" class ="msg"> Great! </p>');
        $msg = $('.msg');
    }
    if(result == 'not-word'){
        $msg.replaceWith ('<p id="not-word-msg" class ="msg">That is not a valid word. PLease try again.</p>');
        $msg = $('.msg');
    }
    if(result == 'not-on-board'){
        $msg.replaceWith ('<p id="not-on-board-msg" class ="msg">That word is not on the board. Please try again.</p>');
        $msg = $('.msg');
    }


    // clear input text box after form submitted
    $('#user-guess').val('');

});

