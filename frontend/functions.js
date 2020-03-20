document.getElementById('msg-input').onkeypress = function(event) {
    if (event.keyCode == 13 || event.which == 13) {
        let messageContent = document.getElementById('msg-input').value;

        if (messageContent.length < 1) return;

        if (messageContent.length > 2000)
            return alert('Message is greater than 2k characters.');

        socket.emit('message_send', messageContent, message => {
            if (!message) {
                return alert(
                    'Your message was not sent. This could happen if we recieve too many requests from you.'
                );
            }
        });

        document.getElementById('msg-input').value = '';

        return false;
    }
};

socket.on('message_send', msg => {
    let comment_div = document.createElement('div');
    comment_div.setAttribute('class', 'comment');

    /* Start Avatar */
    let avatar_a = document.createElement('a');
    avatar_a.setAttribute('class', 'avatar');

    let avatar_img = document.createElement('img');
    avatar_img.setAttribute(
        'src',
        'https://fomantic-ui.com/images/avatar/small/stevie.jpg'
    );

    avatar_a.appendChild(avatar_img);
    /* End Avatar */

    /* Start Content */
    let content_div = document.createElement('div');
    content_div.setAttribute('class', 'content');

    // Author
    let author_a = document.createElement('a');
    author_a.setAttribute('class', 'author');
    author_a.innerText = 'Test User';
    content_div.appendChild(author_a);

    // Metadata
    let metadata_div = document.createElement('div');
    metadata_div.setAttribute('class', 'metadata');
    content_div.appendChild(metadata_div);

    // Date
    let date_div = document.createElement('div');
    date_div.setAttribute('class', 'date');
    date_div.innerText = '2 days ago';
    metadata_div.appendChild(date_div);

    // Message
    let message_div = document.createElement('div');
    message_div.setAttribute('class', 'text');
    message_div.innerText = msg;
    content_div.appendChild(message_div);
    /* End Content */

    // Append author & message
    comment_div.appendChild(avatar_a);
    comment_div.appendChild(content_div);

    document.getElementById('messages').appendChild(comment_div);
    document.getElementById('messages').scrollTop = document.getElementById(
        'messages'
    ).scrollHeight;
});
