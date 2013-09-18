'use strict';

define(
  ['Zepto', 'logic/game_context', 'tmpl'],
  function ($, game_context, tmpl){

  $(function($){

    // progress bar plugin
    (function($){
        $.extend($.fn, {
            progress: function(params){
              if (typeof params === 'number') params = {progress: params};
              else if (params == null) params = {};
              return $(this).each(function(){
                if(!this.progress){
                  this.progress = $('<div class="progress" />');
                  $(this).append(this.progress);
                }

                if(params.progress != null){
                  this.progress.css('width', params.progress + '%');
                }
              });
            }
        });
    })($);

    var PROGRESS_REFRESH_TIME = 1000;


    // Getting elements
    var $pic = $('#panel-pic');
    var $status = $('#panel-status');
    var $actions = $('#panel-actions');

    var displayEntity;
    var progressBar;

    $actions.on('click', 'a[data-action]', function(e) {
      console.log('clicked on action');
      console.log(e);

      var act = $(e.currentTarget).attr('data-action');

      console.log(act);

      displayEntity.actions[act].cb();
    });


    $('.panel').bind('mousedown', function(evt){
      evt.preventDefault();
      evt.stopPropagation();

      return false;
    });

    var updateListener = {
      onUpdate: function() {
        updateDOM();
      }
    };

    function checkProgress() {
      if(progressBar != null && displayEntity != null) {
        progressBar.progress(displayEntity.getCurrentUnitProgress());
      }

      window.setTimeout(checkProgress, PROGRESS_REFRESH_TIME);
    }
    checkProgress();

    function setDisplayEntity(ent) {
      if (displayEntity != null)
        displayEntity.removeListener(updateListener);
      displayEntity = ent;
      ent.addListener(updateListener);
      updateDOM();
    }

    function updateDOM() {
      var actions = tmpl('t_actions', {actions: displayEntity.actions});
      var status = tmpl('t_factory_status', displayEntity);

      $actions.empty().append(actions);
      $status.empty().append(status);

      progressBar = $status.find('.progress-bar').progress();

      if(progressBar != null && displayEntity != null) {
        progressBar.progress(displayEntity.getCurrentUnitProgress());
      }
    }

    game_context.addListener({
      onSelectEntity: function(ent) {
        setDisplayEntity(ent);
      }
    });

    /*var menu = (function(){

      var REFRESH_RATE = 500;


      var el = $('#menu');
      var active = false;

      var soldierFactory = getFactoy($('#soldier-factory'));
      var tankFactory = getFactoy($('#tank-factory'));

      function getFactoy(el){
        var progress = el.find('.progress-bar').progress();
        return {
          progress: function(arg){ progress.progress(arg);},
          queue: el.find('.factory-queue'),
          currentUnit: el.find('.current-unit')
        };
      }


      function refresh(){
        var queue, i, player, factory, div;
        if(active){
          // update stuff

          player = GAME_STATE.players[0];
          factory = player.getFactory('soldier');

          soldierFactory.progress({
            progress: factory.getCurrentUnitProgress()
          });

          queue = factory.getQueue();
          soldierFactory.queue.empty();

          if (factory.queue.length > 0) {
            soldierFactory.currentUnit.empty().addClass('active')
              .append($('<img src="rifleman-icon.png" />'));
          } else {
            soldierFactory.currentUnit.empty().removeClass('active');
          }

          for(i = 1 ; i < factory.queueLength ; i++) {
            div = $('<div class="queued-unit unit-box" />');
            if (i < factory.queue.length) {
              div.addClass('active');
            }
            soldierFactory.queue.append(div);
          }

          window.setTimeout(refresh, REFRESH_RATE);
        }
      }

      el.find('.close-btn').bind('click', function(){
        menu.close();
      });

      return {
        open: function(){
          el.show();
          active = true;
          refresh();
        },

        close: function(){
          el.hide();
          active = false;
        }
      };
    })();

    $('#open-units-menu-btn').bind('click', function(){
      menu.open();
    });*/
  });
});
