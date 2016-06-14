$(function(){
   var todos = [];
   var localdata = localStorage.todos;
   var todos = localdata ? $.parseJSON(localdata):[];
   var state = localStorage.state || 'all'
   //保存数据
   var saveData = function(){
      localStorage.todos = JSON.stringify(todos)
   }
   console.table(todos)
   //渲染数据
   var render = function(){
    var ftodos = $.grep(todos,function(v){
        if(state === 'all'){
           return v;
        }else if(state === 'active'){
            return !v.isDone;
        }else if(state === 'completed'){
           return v.isDone
        }
    })
      $('#todo-list').empty().append(function(){
          return $.map(ftodos,function(v){
             var tmp = v.isDone?'checked':'';
             return '<li class="'+( v.isDone?'completed':'')+'" data-id="'+v.id+'"><div class="view"> <input '+tmp+' type="checkbox" class="toggle"> <label for="">'+v.content+'</label> <button class="destroy"></button> </div> <input class="edit" type="text" value="'+v.content+'"> </li>'

          })
      })
     $('#footer .selected').removeClass('selected');
     $('#footer a[data-role='+state+']').addClass('selected');
     $('#todo-count strong').text(ftodos.length);
   };
   render()
   //增加数据
   var addTodo = function(e){
      var zhi = $.trim($(this).val());
      if(e.keyCode === 13 && zhi!==''){
         var li = $(this).closest('li')

         var todo = {
            id: todos.length ?(Math.max.apply(null,$.map(todos,function(v){
                return v.id;
            }))+1):1001,
            content:zhi,
            isDone:false
         }
         $(this).val('');
         todos.push(todo);
         saveData();
         render()
      }
   }
  $('#new-todo').on('keyup',addTodo);
  //删除数据
  var deleteTodo = function(){
      var li = $(this).closest('li')
      var id = parseInt($(this).closest('li').attr('data-id'));
      todos = $.grep(todos,function(v){
          return v.id  !==id;
      })
      saveData();
      li.fadeOut(500,render)
  }
  $('#todo-list').on('click','.destroy',deleteTodo);

  var gaizhuangtai = function(){
     var state = $(this).prop('checked');
     var id = parseInt($(this).closest('li').attr('data-id'));
     $.each(todos,function(i,v){
        if(v.id === id){
           v.isDone = state;
        }
     })
     saveData();
     render();
  }

  $('#todo-list').on('click','.toggle',gaizhuangtai);

  //修改内容
  var updataneirong = function(){
      $(this).addClass('editing');
      $(this).find('.edit').focus();
  }
  $('#todo-list').on('dblclick','li',updataneirong)
  $('#todo-list').on('change','.edit',updataneirong)


  $('#todo-list').on('focusout','.edit',function(){
      $(this).closest('li').removeClass('editing');
      var li = $(this).closest('li');
      var id = parseInt($(this).closest('li').attr('data-id'));
      var self = this;
      $.each(todos,function(i,v){
        if(v.id === id){
            v.content = $(self).val();

        }
      })
      saveData()
      render()

  })

  // 状态关联
  $('#filters a').on('click',function(){
      $('#filters .selected').removeClass('selected');
      $(this).addClass('selected');
      state = localStorage.state = $(this).attr('data-role');
      render();
      return false;
  })



})
