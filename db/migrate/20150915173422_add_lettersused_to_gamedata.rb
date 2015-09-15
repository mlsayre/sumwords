class AddLettersusedToGamedata < ActiveRecord::Migration
  def change
  	add_column :gamedata, :lettersused, :integer, default: 0
  end
end
