class PagesController < ApplicationController
  include ActionView::Helpers::DateHelper

  def endgames
    @gamestoend = []
    Game.all.each do |game|
      @gamedata = Gamedata.where(:game_id => game.id).all
      @count = @gamedata.count
      if @gamedata.last
        @lastdate = @gamedata.last.updated_at
        if @count > 3 && DateTime.now - @lastdate.to_datetime >= 1 #minutes
          @gamestoend |= [game.id]
        end
      end
    end
    @gamestoend.each do |endgame|
      Game.find(endgame).update(:gameended => true)
    end

    render :nothing => true
  end
end
