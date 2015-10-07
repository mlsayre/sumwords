class Gamedata < ActiveRecord::Base
  def gamerank(gameid, userid)
    @numberofscores = Gamedata.where(:game_id => gameid).all.count
    @playerrank = Gamedata.where(:game_id => gameid).order('score DESC, updated_at ASC').collect(&:user_id)
                          .index(userid) + 1
    "#{@playerrank.ordinalize} of #{@numberofscores}"
  end
end
