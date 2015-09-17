class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :destroy]
  # GET /games
  # GET /games.json
  def index
    @games = Game.all
  end

  # GET /games/1
  # GET /games/1.json
  def show
    @upperleftspace = @game.upperleftspace
    @upperrightspace = @game.upperrightspace
    @lowerleftspace = @game.lowerleftspace
    @lowerrightspace = @game.lowerrightspace
    @randspace01 = @game.randspace01
    @randspace02 = @game.randspace02
    @randspace03 = @game.randspace03
    @randspace04 = @game.randspace04
    @randspace05 = @game.randspace05
    @randspace06 = @game.randspace06
    @randspace07 = @game.randspace07
    @randspace08 = @game.randspace08
    @randspace09 = @game.randspace09
    @randspace10 = @game.randspace10
    @randspace11 = @game.randspace11
    @randspace12 = @game.randspace12
    @randspace13 = @game.randspace13
    @randspace14 = @game.randspace14
    @randspace15 = @game.randspace15
    @randspace16 = @game.randspace16
    @letter01 = @game.letters[0]
    @letter02 = @game.letters[1]
    @letter03 = @game.letters[2]
    @letter04 = @game.letters[3]
    @letter05 = @game.letters[4]
    @letter06 = @game.letters[5]
    @letter07 = @game.letters[6]
    @letter08 = @game.letters[7]
    @letter09 = @game.letters[8]
    @letter10 = @game.letters[9]

    def letterpoints(letter)
      if letter == "L" || letter == "S" || letter == "U" ||
         letter == "N" || letter == "R" || letter == "T" ||
         letter == "O" || letter == "A" || letter == "I" ||
         letter == "E"
        1
      elsif letter == "G" || letter == "D"
        2
      elsif letter == "B" || letter == "C" || letter == "M" || letter == "P"
        3
      elsif letter == "F" || letter == "H" || letter == "V" || letter == "W" || letter == "Y"
        4
      elsif letter == "K"
        5
      elsif letter == "J" || letter == "X"
        8
      elsif letter == "Q" || letter == "Z"
        10
      end
    end

    @letter01points = letterpoints(@letter01)
    @letter02points = letterpoints(@letter02)
    @letter03points = letterpoints(@letter03)
    @letter04points = letterpoints(@letter04)
    @letter05points = letterpoints(@letter05)
    @letter06points = letterpoints(@letter06)
    @letter07points = letterpoints(@letter07)
    @letter08points = letterpoints(@letter08)
    @letter09points = letterpoints(@letter09)
    @letter10points = letterpoints(@letter10)

    # show high score
    if Gamedata.where(:game_id => @game.id).first
      @highscore = Gamedata.where(:game_id => @game.id).order('score DESC').first
      @lowscore = Gamedata.where(:game_id => @game.id).order('score DESC').last
    end
    if Gamedata.where(:game_id => @game.id).where(:user_id => current_user.id).first
      @playerhighscore = Gamedata.where(:game_id => @game.id).where(:user_id => current_user.id).first
    end
  end

  def checkwords
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

    receivedwords = (params[:potentialwords])
    receivedwords.map! {|word| word.gsub(/\d+/, "")}
    receivedwords.map! {|word| word.downcase}

    invalidwords = []
    validwords = []
    removewordscount = receivedwords.count - 1
    for i in 0..removewordscount
      if @allwords.include?(receivedwords[i])
        validwords.push(receivedwords[i])
      else
        invalidwords.push(receivedwords[i])
      end
    end

    render :json => [invalidwords, validwords]
  end

  # GET /games/new
  def new
    @game = Game.new
    if current_user
      @playergames = Gamedata.where(:user_id => current_user.id).order('game_id DESC').all
      @playergameslist = @playergames.page(params[:page]).per(12)
    end
  end

  # GET /games/1/edit
  def edit
  end

  # POST /games
  # POST /games.json
  def create
    if current_user
      @allgames = Game.all.collect(&:id)
      @gamesunavailableids = Gamedata.where(:user_id => current_user.id).collect(&:game_id)
      @gamesavailableids = @allgames - @gamesunavailableids
      @gamesavailable = Game.where(:id => @gamesavailableids).where(:gamefull => false).all
      if @gamesavailable.count > 0
        @game = @gamesavailable.first
        respond_to do |format|
          format.html { redirect_to @game, notice: 'Game was successfully joined.' }
          format.json { render :show, status: :created, location: @game }
        end
      else #need to create a new game
        @game = Game.new

        # randomize corners
        cornerrand = rand(1..2)
        if cornerrand == 1
          @upperleftspace = " dw"
          @lowerrightspace = " dw"
        elsif cornerrand == 2
          @upperrightspace = " dw"
          @lowerleftspace = " dw"
        end
        @game.update(:upperleftspace => @upperleftspace, :upperrightspace => @upperrightspace,
          :lowerleftspace => @lowerleftspace, :lowerrightspace => @lowerrightspace)


        # randomize other board spaces
        randomtilearray = [" dl", " dl", " dl", " dl", " dl", " tl", " tl", " tl", "", "", "", "", "", "", "", "" ]
        randomtilearray.shuffle!
        @game.update(:randspace01 => randomtilearray[0], :randspace02 => randomtilearray[1],
                     :randspace03 => randomtilearray[2], :randspace04 => randomtilearray[3],
                     :randspace05 => randomtilearray[4], :randspace06 => randomtilearray[5],
                     :randspace07 => randomtilearray[6], :randspace08 => randomtilearray[7],
                     :randspace09 => randomtilearray[8], :randspace10 => randomtilearray[9],
                     :randspace11 => randomtilearray[10], :randspace12 => randomtilearray[11],
                     :randspace13 => randomtilearray[12], :randspace14 => randomtilearray[13],
                     :randspace15 => randomtilearray[14], :randspace16 => randomtilearray[15])

        # pick 10 letters
        def pickletters
          @potentialletters = File.new("config/LetterDistribution").readlines.sample(10).join.gsub("\n", "")
          if @potentialletters.count("AEIOU") <= 3 || @potentialletters.count("AEIOU") >= 6
            pickletters
          else
            @game.update(:letters => @potentialletters)
          end
        end
        pickletters

        respond_to do |format|
          if @game.save
            format.html { redirect_to @game, notice: 'Game was successfully created.' }
            format.json { render :show, status: :created, location: @game }
          else
            format.html { render :new }
            format.json { render json: @game.errors, status: :unprocessable_entity }
          end
        end
      end

    else
      @game = Game.limit(1).order("RANDOM()").first
      respond_to do |format|
        format.html { redirect_to @game, notice: 'Game was successfully joined.' }
        format.json { render :show, status: :created, location: @game }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.json
  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url, notice: 'Game was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def highscores
    @game = Game.find(params[:id])
    @gamedata = Gamedata.where(:game_id => @game.id).order('score DESC').all
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params.require(:game).permit(:letters)
    end
end
