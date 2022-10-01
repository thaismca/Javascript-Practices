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

    generateMatchResultString({awayTeam, homeTeam}){
      //substring with Team names
      const teamsSubstring = `${awayTeam.team} @ ${homeTeam.team} | `

      //if the home team is the winner, the <b> tag will be around the homePoints
      //else, the <b> tag will be around the awayPoints
      const scoreSubstring = (homeTeam.isWinner ?
        `${awayTeam.points} - <b>${homeTeam.points}</b>` :
         `$<b>${awayTeam.points}</b> - ${homeTeam.points}`
      )

      return teamsSubstring + scoreSubstring;
    },
  
    setLineBgColor({awayTeam, homeTeam}){
      //check who won the match and store the name of the winner in a variable
      let winner = (homeTeam.isWinner ? homeTeam.team : awayTeam.team);
      //check if that winner name matches the fan's perspective and return a
      //string that represents the name of the class that must be applied
      return (winner === this.fanPerspective ? 'win' : 'loss')
    },

    generateResultsList(){
        //create a ul where the list items will be appended as children
        const newUl = document.createElement('ul');
    
        //loop through all objects in the results array from this object's results property
        for(match of this.results){        
          //create the empty li element
          const newLi = document.createElement('li');
    
          //insert the string returned from the generateMatchResultString method
          //using innerHTML because we have a <b> tag in the returned string
          newLi.innerHTML = this.generateMatchResultString(match);
          
          //apply the propper bg colors to the list element 
          newLi.classList.add(this.setLineBgColor(match));
          
          //append this new list item as child of the ul element
          newUl.appendChild(newLi); 
        };
          
        //return the newUl element containing all match results added as list items
        return newUl;
    }
}

//decided to change the exercise a bit and only load the list after chosing the team in a form
const form = document.body.querySelector('#teamSelection');
form.addEventListener("submit", function(e) {
  //prevent the default form behavior to continue on the same page after submission
  e.preventDefault();
  
  //if there is a list currently loaded, remove that before creating a new one
  const existingList = document.body.querySelector('#resultsList ul');
  if(existingList) {existingList.remove();}

  //save the selected team to a variable
  const team = document.querySelector('#teams').value;
  //create an object res based on the resultsList
  const res = resultsList;
  //populate res properties according to the warriorsGames array and the team selected in the form
  res.populateProperties(warriorsGames, team);
  //generate the list with the results
  const list = res.generateResultsList();
  //append list to the page
  document.body.querySelector('#resultsList').appendChild(list);
})



