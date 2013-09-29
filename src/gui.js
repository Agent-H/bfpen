'use strict';

define(
  ['Zepto', 'logic/game_context', 'tmpl', 'logic/game_state'],
  function ($, game_context, tmpl, game_state){

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

    var PROGRESS_REFRESH_TIME = 300;


    // Getting elements
    var $pic = $('#panel-pic');
    var $status = $('#panel-status');
    var $actions = $('#panel-actions');
    var $cash = $('#cash');

    var player = game_state.getActualPlayer();


    function updateCash() {
      $cash.text(player.getMoney());
    }
    player.addListener({
      onUpdate: updateCash
    });
    updateCash();

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
      if(progressBar != null && displayEntity != null && displayEntity.selType === 'factory') {
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
      $actions.empty().append(actions);

      if (displayEntity.selType === 'factory') {
        var status = tmpl('t_factory_status', displayEntity);


        $status.empty().append(status);

        progressBar = $status.find('.progress-bar').progress();

        if(progressBar != null && displayEntity != null) {
          progressBar.progress(displayEntity.getCurrentUnitProgress());
        }

        $status.find('.queue-item').click(function() {
          displayEntity.abortUnit(parseInt($(this).attr('data-queueid')));
        });
      } else {
        $status.empty();
      }
    }

    game_context.addListener({
      onSelectEntity: function(ent) {
        setDisplayEntity(ent);
      }
    });


  });
});
