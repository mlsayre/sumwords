class GamedataController < ApplicationController

  def gamecompleted
    if current_user
      @user_id = current_user.id
      @game_id = (params[:game_id])
      @finalpoints = (params[:finalpoints])
      @finaltilepositions = (params[:finalpositions])

      if Gamedata.where('game_id = ?', @game_id).where(:user_id => @user_id).first
        @gamedata = Gamedata.where('game_id = ?', @game_id).where(:user_id => @user_id).first
        @gamedata.update_attributes!(:score => @finalpoints, :finaltiles => @finaltilepositions)
      else
        # create new entry...
        @gamedata = Gamedata.new
        @gamedata.update_attributes!(:game_id => @game_id, :user_id => @user_id,
          :score => @finalpoints, :finaltiles => @finaltilepositions)
      end

      @gamecompletemessage = "Score successfully submitted."
      @userloggedin = 1

    else
      @gamecompletemessage = "Join or log in to track your high scores and compare them to other players!"
      @userloggedin = 0
    end

    render :json => [@gamecompletemessage, @userloggedin]

  end

  private
  # Use callbacks to share common setup or constraints between actions.

  # Never trust parameters from the scary internet, only allow the white list through.
  # def gamedata_params
  #   params.require(:gamedata).permit(:r1answer, :r2answer, :r3answer, :r4answer,
  #     :r5answer, :r6answer, :r7answer, :r8answer, :r1voted, :r2voted,
  #     :r3voted, :r4voted, :r5voted, :r6voted, :r7voted, :r8voted,
  #     :r1votedfor, :r2votedfor, :r3votedfor, :r4votedfor, :r5votedfor, :r6votedfor,
  #     :r7votedfor, :r8votedfor, :r1points, :r2points, :r3points, :r4points,
  #     :r5points, :r6points, :r7points, :r8points, :game_id)
  # end
end
