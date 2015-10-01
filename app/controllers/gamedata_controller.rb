class GamedataController < ApplicationController

  def gamecompleted
    if current_user
      @user_id = current_user.id
      @game_id = (params[:game_id])
      @finalpoints = (params[:finalpoints]).to_i
      @finallettersused = (params[:lettersused])
      @finaltilepositions = (params[:finalpositions])

      if Gamedata.where('game_id = ?', @game_id).where(:user_id => @user_id).first
        @gamedata = Gamedata.where('game_id = ?', @game_id).where(:user_id => @user_id).first

        if @gamedata.score <= @finalpoints
          @gamedata.update_attributes!(:score => @finalpoints, :finaltiles => @finaltilepositions,
            :lettersused => @finallettersused)
          @gamecompletemessage = "Score successfully submitted."
        else
          @gamecompletemessage = "Your current board's high score is not higher than your previous high score."
        end

      else
        # create new entry...
        @gamedata = Gamedata.new
        @gamedata.update_attributes!(:game_id => @game_id, :user_id => @user_id,
          :score => @finalpoints, :finaltiles => @finaltilepositions, :playername => current_user.username,
          :lettersused => @finallettersused)
        @gamecompletemessage = "Score successfully submitted."
        # set game to full if new entry is #10
        if Gamedata.where(:game_id => @game_id).count >= 10
          Game.find(@game_id).update(:gamefull => true)
        end
      end


      @userloggedin = 1

      # mark game as full if this is the 20th high score
      if Gamedata.where('game_id = ?', @game_id).count >= 20
        Game.where(:id => @game_id).update_attributes!(:gamefull => true)
      end

    else
      @gamecompletemessage = "Join or log in to track your high scores and compare them to other players!"
      @userloggedin = 0
    end

    render :json => [@gamecompletemessage, @userloggedin]

  end

    def getallwords
    @game = Game.find(params[:id])
    @allwords = File.new("config/EnglishWords").readlines
    @allwords.map! {|word| word.gsub!("\n", "")}
    wholealphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
      "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    givenletters = @game.letters.split("")
    givenletters.map! {|letter| letter.downcase}
    letterstoremove = wholealphabet - givenletters

    # remove words that contain letters player doesn't have
    removelettercount = letterstoremove.count - 1
    for i in 0..removelettercount
      @allwords.reject! { |word| word.include?(letterstoremove[i]) }
    end

    # remove words that contain too many of the given letters
    for i in 0..9
      lettersinarray = givenletters.count(givenletters[i])
      @allwords.reject! { |word| word.count(givenletters[i]) > lettersinarray }
    end

    @allwordsarray = @allwords

    render :json => [@allwordsarray]

    # receivedwords = (params[:potentialwords])
    # receivedwords.map! {|word| word.gsub(/\d+/, "")}
    # receivedwords.map! {|word| word.downcase}

    # invalidwords = []
    # validwords = []
    # removewordscount = receivedwords.count - 1
    # for i in 0..removewordscount
    #   if @allwords.include?(receivedwords[i])
    #     validwords.push(receivedwords[i])
    #   else
    #     invalidwords.push(receivedwords[i])
    #   end
    # end

    # render :json => [invalidwords, validwords]
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
