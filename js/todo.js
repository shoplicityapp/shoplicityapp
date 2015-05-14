$(function() {
 
    Parse.$ = jQuery; 
    //Initialize API
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
                    username = data[0].value.trim().toLowerCase(),
                    password = data[1].value;
                
                //Call Parse login function with those variables
                Parse.User.logIn(username, password, {
                    success: function(user) {
                       location.reload();
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
    var currentUser = Parse.User.current();
    if (currentUser) {
        var Todo = Parse.Object.extend("Todo");
        var Todos = Parse.Collection.extend({
            model: Todo
        });
        var todos = new Todos();
        var addTodoView = new AddTodoView();
        addTodoView.render();
        $('.todo-form').html(addTodoView.el);

        todos.fetch({
            success: function(todos) {
                var todosView = new TodosView({ collection: todos });
                todosView.render();
                $('.todo-list').html(todosView.el);
            },
            error: function(todos, error) {
                console.log(error);
            }
        });
        var TodosView = Parse.View.extend({
            template: Handlebars.compile($('#todos-tpl').html()),
            render: function() {
                var collection = { todo: this.collection.toJSON() };
                this.$el.html(this.template(collection));
            }
        });
    }
    else {
        var loginView = new LoginView();
        loginView.render();
        $('.main-container').html(loginView.el);
    }
    
    
    var Todo = Parse.Object.extend('Todo', {
        create: function(title) {
            this.setACL(new Parse.ACL(Parse.User.current()));
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