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

//this code will generate the same result as the firstSolution script

//each match to become an item in an unordered list
//each item in the list displayed following the pattern
//awayTeam @ homeTeam | awayTeamScore - homeTeamScore
//winning score displayed in bold style
//Golden State losses displayed with a red bg
//Golden State wins displayed with a green bg

//but this time it should generate the list and color the winner from whatever perspective
//that is passed as parameter (if from warriors fan perspective, warriors' wins in green,
//and the opposite if it's from the houston fan perspective)

//it should also be able to receive any array with game results following this same structure

const resultsList = {
    results: [],
    fanPerspective: "",
    
    populateProperties(results, perspective){
        this.results = results;
        this.fanPerspective = perspective;
    },

    setLineBgColor(away, home){
        //check who won the match and store the name of the winner in a variable
        let winner = (home.isWinner ? home.team : away.team);
        //check if that winner name matches the fan's perspective and return a
        //string that represents the propper result
        return (winner === this.fanPerspective ? 'win' : 'loss')
    },

    generateTeamsSubstring(away, home){
        return `${away.team} @ ${home.team} | `
    },

    generateScoreSubstring(away, home){
        //if the home team is the winner, the <b> tag will be around the homePoints
        //else, the <b> tag will be around the awayPoints
        return (home.isWinner ?
            `${away.points} - <b>${home.points}</b>` :
            `$<b>${away.points}</b> - ${home.points}`
          )
    },

    generateResultsList(){
        //create a ul where the list items will be appended as children
        const newUl = document.createElement('ul');
    
        //loop through all objects in the results array from this object's results property
        const results = this.results;
        for(match of results){
            //store informations about away team in variables
            const away = {...match.awayTeam};
            //store informations about home team in variables
            const home = {...match.homeTeam};
          
            //create the empty li element
            const newLi = document.createElement('li');
    
            //create a string that have the text to be inserted in the list item
            const insert = this.generateTeamsSubstring(away, home) + this.generateScoreSubstring(away, home);
            //apply the propper bg colors to the list element 
            newLi.classList.add(this.setLineBgColor(away, home));
            //insert the text using innerHTML because we have a <b> tag in the string
            newLi.innerHTML = insert;
            //append this new list item as child of the ul element
            
            newUl.appendChild(newLi); 
          };
          
          //insert the ul to the document
          document.body.querySelector('#resultsList').appendChild(newUl);
    }
}

//decided to anticipate myself and try to load the list after chosing the team in a form and clicking the button
const btn = document.body.querySelector('input[type=button]');
btn.addEventListener("click", function() {
    //if there is a list currently loaded, remove that before creating a new one
    const existingList = document.body.querySelector('#resultsList ul');
    if(existingList != null) {existingList.remove();}

    //save the selected team to a variable
    const team = document.querySelector('#teams').value;
    //create an object res based on the resultsList
    const res = resultsList;
    //populate res properties according to the warriorsGames array and the team selected in the form
    res.populateProperties(warriorsGames, team);
    //generate the list with the results
    res.generateResultsList();
})



