class AddNameToGamedata < ActiveRecord::Migration[6.1]
  def change
    add_column :gamedata, :playername, :string
  end
end
