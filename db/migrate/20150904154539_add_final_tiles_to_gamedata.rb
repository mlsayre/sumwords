class AddFinalTilesToGamedata < ActiveRecord::Migration[6.1]
  def change
    add_column :gamedata, :finaltiles, :string, array: true, default: []
  end
end
