const warriorsGames = [{
    awayTeam: {
      team: 'Golden State',
      points: 119,
      isWinner: true
    },
    homeTeam: {
      team: 'Houston',
      points: 106,
      isWinner: false
    }
  },
  {
    awayTeam: {
      team: 'Golden State',
      points: 105,
      isWinner: false
    },
    homeTeam: {
      team: 'Houston',
      points: 127,
      isWinner: true
    }
  },
  {
    homeTeam: {
      team: 'Golden State',
      points: 126,
      isWinner: true
    },
    awayTeam: {
      team: 'Houston',
      points: 85,
      isWinner: false
    }
  },
  {
    homeTeam: {
      team: 'Golden State',
      points: 92,
      isWinner: false
    },
    awayTeam: {
      team: 'Houston',
      points: 95,
      isWinner: true
    }
  },
  {
    awayTeam: {
      team: 'Golden State',
      points: 94,
      isWinner: false
    },
    homeTeam: {
      team: 'Houston',
      points: 98,
      isWinner: true
    }
  },
  {
    homeTeam: {
      team: 'Golden State',
      points: 115,
      isWinner: true
    },
    awayTeam: {
      team: 'Houston',
      points: 86,
      isWinner: false
    }
  },
  {
    awayTeam: {
      team: 'Golden State',
      points: 101,
      isWinner: true
    },
    homeTeam: {
      team: 'Houston',
      points: 92,
      isWinner: false
    }
  }
]

//each match to become an item in an unordered list
//each item in the list displayed following the pattern
//awayTeam @ homeTeam | awayTeamScore - homeTeamScore
//winning score displayed in bold style
//Golden State losses displayed with a red bg
//Golden State wins displayed with a green bg

//note: this first version is just my first attempt on solving the exercise
//before watching the video showing how the instructor would do that

//create a ul where the list items will be appended as children
const newUl = document.createElement('ul');

//loop through all objects in the array
warriorsGames.forEach(element => {
  //store informations about away team in variables
  const away = {...element.awayTeam}
  
  //store informations about home team in variables
  const home = {...element.homeTeam}

  //create the empty li element
  let newLi = document.createElement('li');

  //check who won the match and store the name of the winner in a variable
  let winner = (home.isWinner ? home.team : away.team);
  //check if that winner name matches 'Golden State' and assign the appropriate bg color
  //green if Golden State is the winner, red if it's not
  newLi.style.backgroundColor = (winner === 'Golden State' ? '#b3e6b3': '#ffb3b3');

  //create a string that will have the text to be inserted in the list item
  //since we need to add a <b> tag, it will be inserted using innerHTML
  //if the home team is the winner, the <b> tag will be around the homePoints
  //else, the <b> tag will be around the awayPoints
  let insert = (home.isWinner ?
    `${away.team} @ ${home.team} | ${away.points} - <b>${home.points}</b>` :
    `${away.team} @ ${home.team} | <b>${away.points}</b> - ${home.points}`
  );
  
  //insert the text using innerHTML because we have a <b> tag in the string
  newLi.innerHTML = insert;
  //append this new list item as child of the ul element
  newUl.appendChild(newLi); 
});

//insert the ul to the document
document.body.insertAdjacentElement("afterbegin", newUl);