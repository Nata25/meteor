Websites = new Mongo.Collection("websites");

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
			return Websites.find({}, {sort:{rating:-1}});
		}
	});

	Template.addDate.helpers({
		formattedDate:function() {
			var monthNames = [
		  "January", "February", "March",
		  "April", "May", "June", "July",
		  "August", "September", "October",
		  "November", "December"
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
			console.log("Up voting website with id "+website_id);
			// add a vote to a website!
			upvotes = this.upvotes;
			downvotes = this.downvotes;
			upvotes++;
			console.log("The website has", upvotes, "upvotes");

			var rating = upvotes - downvotes;

			console.log("The rating is ", rating);

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
			console.log("Down voting website with id "+website_id);
			// remove a vote from a website!
			upvotes = this.upvotes;
			downvotes = this.downvotes;
			downvotes++;
			var rating = upvotes - downvotes;
			Websites.update({_id:website_id},
						  {$set: {rating:rating,
						  		  downvotes:downvotes}
					  	  });

			console.log("The website has the rating", rating);
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);

			var title = event.target.title.value;
			console.log("The title is: "+title);
			var description = event.target.description.value;
			console.log("What the site is about: "+description);

			if (Meteor.user()) {
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

			}
			return false;// stop the form submit from reloading the page

		}
	});

	Template.comment.events({
		"submit .js-comment-form":function(event) {

			// var username = Meteor.user().emails[0].address;
			var username = Meteor.user().username;
			var comment = event.target.comment.value;
			event.target.comment.value = '';
			console.log("submitting comment by", username);
			console.log("here's the comment:", comment);
			return false;
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
    		createdOn:new Date(),
			upvotes:0,
			downvotes:0
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),
			upvotes:0,
			downvotes:0
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),
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
