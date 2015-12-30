$(function(){
	$('#currentGuess').val('');
	window.wrongChampions=[]
    $('#currentGuess').prop('disabled',false);
	$('#currentGuess').focus();
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function dumbDownName(name){
		return name.toLowerCase().replace(" ",'').replace("'","");
	}
	$('#skip').click(function(){
		pickNewChampion(false);
		$('#currentGuess').focus();
		
	})
	window.timerId=-1;
	$.get("champion.json",function(data){
		champs=data['data'];
		window.champions=[];
		count=0;
		/*for(ch in window.champs){
			window.champions[count++]=ch;
		}*/
		window.champions=_.map(champs,function(data){return data;})
		pickNewChampion();
	});
	
	function pickNewChampion(hasGuessed=true){
		if(hasGuessed==false){
			window.wrongChampions.push(window.currentChampion['name']+"-"+window.currentChampion["title"]);
			console.log("hi");
		}
		championChosen=Math.floor(Math.random()*_.size(window.champions));
		window.currentChampion=window.champions[championChosen]; //black magics
		$('#champion-title').html(capitalizeFirstLetter(window.currentChampion['title']));
		$('#currentGuess').val('');
	}
$('#currentGuess').on('keyup',function(event){
	if(event.key=="Enter"){
		pickNewChampion(false);
	}
	if(window.timerId==-1){
		 window.timerId=setInterval(function(){
			 $('#timer').html(parseInt($('#timer').html())-1);
			 if($('#timer').html()==0){
				 clearInterval(window.timerId);
				 $('#currentGuess').prop('disabled',true);
				 $('#results').css('display','inline-block');
				 $('#wrong-champs').html(window.wrongChampions.join("<br>"));
			 }
	},1000);
	}
		 if(dumbDownName($('#currentGuess').val())==dumbDownName(window.currentChampion['name'])){
			 pickNewChampion();
			 $('#timer').html(parseInt($('#timer').html())+5);

			 $('#currentGuesses').html(parseInt($('#currentGuesses').html())+1);
			 
		 }
		 //console.log($('#currentGuess').val()+"=="+dumbDownName(window.currentChampion['name']));
	
	
});
});