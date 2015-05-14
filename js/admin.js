$(function() {
 
    Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("Epz66RPY781jOh7idBExXWbASgaAYTm7KNGKMDvn", "yLeoiq1IrhUg3waEsyiMbrsFyAykUrlOq9skANnW");
    var AddTodoView = Parse.View.extend({
        template: Handlebars.compile($('#add-tpl').html()),
        events: {
            'submit .form-add': 'submit'
        },
        submit: function(e) {
            e.preventDefault();
            //Take the form and put it in a data object
            var data = $(e.target).serializeArray(),
            //Create a new instance of Todo
                todo = new Todo();
            //Call .creat()
            todo.create(data[0].value);
        },
        render: function(){
            this.$el.html(this.template());
        }
    });
    var LoginView = Parse.View.extend({
            template: Handlebars.compile($('#login-tpl').html()),
            events: {
                'submit .form-signin': 'login'
            },
            login: function(e) {
                
                //Prevent Default 
                e.preventDefault();
                
                // Get data from the form and put them into variables
                var data = $(e.target).serializeArray(),
                    username = data[0].value,
                    password = data[1].value;
                
                //Call Parse login function with those variables
                Parse.User.logIn(username, password, {
                    success: function(user) {
                        var welcomeView = new WelcomeView({ model: user });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    },
                    // If there is an error
                    error: function(user, error) {
                        console.log(error);
                    }
                });
            },
            render: function() {
                this.$el.html(this.template());
            }
        });
        WelcomeView = Parse.View.extend({
            template: Handlebars.compile($('#welcome-tpl').html()),
            events: {
                'click .add-todo': 'add'
            },
            add: function(){
                var addTodoView = new AddTodoView();
                addTodoView.render();
                $('.main-container').html(addTodoView.el);
            },
            render: function() {
                var attributes = this.model.toJSON();
                this.$el.html(this.template(attributes));
            }
        });

    //var loginView = new LoginView();
    //loginView.render();
    //$('.main-container').html(loginView.el);
    var Todo = Parse.Object.extend('Todo', {
        create: function(title) {
            this.save({
                'complete':false,
                'title': title,
                'author': Parse.User.current(),
                'creator': Parse.User.current().get('username'),
                'time': new Date().toDateString()
            }, {
                success: function(todo) {
                    location.reload();
                },
                error: function(todo, error) {
                    console.log(todo);
                    console.log(error);
                }
            });
        }

    });
   
});