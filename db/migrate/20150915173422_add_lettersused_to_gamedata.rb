class AddLettersusedToGamedata < ActiveRecord::Migration[6.1]
  def change
  	add_column :gamedata, :lettersused, :integer, default: 0
  end
end
