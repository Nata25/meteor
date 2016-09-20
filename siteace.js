Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");


if (Meteor.isClient) {

	/// routing

	Router.configure({
	  layoutTemplate: 'ApplicationLayout'
	});

	Router.route('/', function () {
	  this.render('navbar', {
	    to:'navbar'
	  });
	  this.render('home', {
		 to: 'main'
	  });
	});

	Router.route('/:_id', function () {
	  this.render('navbar', {
	    to:"navbar"
	  });
	  this.render('website_page', {
	    to:"main",
	    data:function(){
	      return Websites.findOne({_id:this.params._id});
	    }
	  });
	});


	/// accounts config

	Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{rating:-1, createdOn:-1}});
		}
	});

	Template.addDate.helpers({
		formattedDate:function() {
			var monthNames = [
		  "Jan", "Feb", "Mar",
		  "Apr", "May", "June", "July",
		  "Aug", "Sept", "Oct",
		  "Nov", "Dec"
		];
			var createdOn = this.createdOn;
			var monthIndex = createdOn.getMonth();
			return monthNames[monthIndex] + " " + createdOn.getDate() + ", " + createdOn.getFullYear();
		}
	});

	/////
	// template events
	/////

	Template.votes.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			// add a vote to a website
			upvotes = this.upvotes;
			downvotes = this.downvotes;
			upvotes++;
			var rating = upvotes - downvotes;

			Websites.update({_id:website_id},
						  {$set: {rating: rating,
							      upvotes: upvotes}
						  });

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			// remove a vote from a website
			upvotes = this.upvotes;
			downvotes = this.downvotes;
			downvotes++;
			var rating = upvotes - downvotes;
			Websites.update({_id:website_id},
						  {$set: {rating:rating,
						  		  downvotes:downvotes}
					  	  });
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
			$("#toggle-btn").toggleClass("glyphicon-minus");
			$("#invalid").hide();
		},
		"submit .js-save-website-form":function(event){
			var valid = true;

			var url = event.target.url.value;
			var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			if (!url || !pattern.test(url)) {
				event.target.url.value = '';
				event.target.url.placeholder = "Please, type a valid url address!";
				valid = false;
			}

			var title = event.target.title.value;
			if (!title) {
				event.target.title.placeholder = "Please, type website title!";
				valid = false;
			}

			var description = event.target.description.value;
			if (!description) {
				event.target.description.placeholder = "Please, type website description!";
				valid = false;
			}

			if (Meteor.user() && valid) {
				Websites.insert(
					{
						title: title,
						url: url,
						description: description,
						createdOn:new Date(),
					    upvotes:0,
					    downvotes:0
					}
				);

				$("#site_saved").modal("show");
				$("#invalid").hide();
			}
			else {
				$("#invalid").show();
			}

			return false;// stop the form submit from reloading the page

		}
	});

	Template.comment.events({
		"submit .js-comment-form":function(event) {
			// var username = Meteor.user().emails[0].address;
			var username = Meteor.user().username;
			var comment = event.target.comment.value;
			var website_id = this._id;

			// post comment if the user is logged in and has put some text:
			if (Meteor.user() && /\w/.test(comment)) {
			event.target.comment.value = '';

				Comments.insert(
					{
					website_id: website_id,
					user: username,
					text: comment,
					posted: new Date(2016, 8, 20)
					}
				);
			}

			return false;
		}
	});

	Template.website_comments.helpers({
		already_commented:function() {
			return Comments.findOne({website_id: this._id});
		},

		display_comments:function(){
			return Comments.find({website_id: this._id}, {sort:{posted:-1}});
		},
       // indicate time when the comment was posted
		time:function() {
			var now, posted, diff, yearInMiliseconds, monthInMiliseconds, dayInMilisecond, hourInMiliseconds;
			now = new Date(2016, 8, 21);
			posted = this.posted;
			diff = now - posted;
			yearInMiliseconds = 31556926000;
			dayInMiliseconds = 86400000;
			hourInMiliseconds = 3600000;
			// if the difference is greater than 1 year, return year diff
			if (diff > yearInMiliseconds) {
				return Math.round(diff / yearInMiliseconds) + " year(s) ago";
			}
			// else calculate month difference
			monthInMiliseconds = yearInMiliseconds / 12;
			if (diff > monthInMiliseconds) {
				return Math.round(diff / monthInMiliseconds) + " month(s) ago";
			}
			// if more than two day passed, calculate difference in days
			if (diff > dayInMiliseconds * 2) {
				return Math.round(diff / dayInMiliseconds) + " days ago";
			}
			// if it was posted within a day
			if (diff > hourInMiliseconds) {
				return "about a day ago";
			}
			// just now option
			return "just now";
		}
	});

}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(2015, 1, 11),
			upvotes:0,
			downvotes:0
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(2016, 2, 2),
			upvotes:0,
			downvotes:0
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(2010, 8, 1),
			upvotes:0,
			downvotes:0
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),
			upvotes:0,
			downvotes:0
    	});
    }
  });
}
