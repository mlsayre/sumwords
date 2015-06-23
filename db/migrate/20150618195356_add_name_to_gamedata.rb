class AddNameToGamedata < ActiveRecord::Migration
  def change
    add_column :gamedata, :playername, :string
  end
end
