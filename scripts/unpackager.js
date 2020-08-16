//Code is from https://github.com/Gdeft/substructure/blob/master/scripts/multioutputcrafter.js as I cannot actually do scripting myself, I barely understand how this works. 

const unpackager = extendContent(GenericCrafter, "unpackager", {
	init(){
	  this.outputItems = [
		new ItemStack(Items.plastanium, 1),
		new ItemStack(Vars.content.getByName(ContentType.item, "antimatter-tech-antimatter"), 1)
	  ];
	  this.super$init();
	},
  
	load(){
	  this.region = Core.atlas.find(this.name);
	  this.frameRegion = [];
	  for(var i = 1; i < 4; i++){
		this.frameRegion.push(Core.atlas.find(this.name + "-frame-" + i));
	  }
	},
  
	draw(tile){
	  entity = tile.ent();
  
	  Draw.rect(this.region, tile.drawx(), tile.drawy());
	},
  
	generateIcons(){
	  return [
		Core.atlas.find(this.name),
	  ]
	},
  
	update(tile){
	  entity = tile.ent();
	  if(entity.cons.valid()){
		entity.progress += this.getProgressIncrease(entity, this.craftTime);
		entity.totalProgress += entity.delta();
		entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);
  
	  } else {
		entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.02);
	  }
  
	  if(entity.progress >= 1){
		entity.cons.trigger();
  
		for(var i = 0; i < this.outputItems.length; i++){
		  this.useContent(tile, this.outputItems[i].item);
		  for(var j = 0; j < this.outputItems[i].amount; j++){
			this.offloadNear(tile, this.outputItems[i].item);
		  }
		}
		Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
		entity.progress = 0;
	  }
  
	  if(entity.timer.get(this.timerDump, this.dumpTime)){
		for(var i = 0; i < this.outputItems.length; i++){
		  this.tryDump(tile, this.outputItems[i].item);
		}
	  }
	},
  
	shouldConsume(tile){
	  for(var i = 0; i < this.outputItems.length; i++){
		if(this.outputItems[i] != null && tile.entity.items.get(this.outputItems[i].item) >= this.itemCapacity) return false;
		 else return true;
	  }
	}
  });
  
  unpackager.size = 1;
  unpackager.hasItems = true;
  unpackager.hasLiquids = false;
  unpackager.craftEffect = Fx.smeltsmoke;
  unpackager.itemCapacity = 5;
  unpackager.consumes.items(new ItemStack(Vars.content.getByName(ContentType.item, "antimatter-tech-sealed-antimatter"), 1));
  unpackager.category = Category.crafting;
  unpackager.buildVisibility = BuildVisibility.shown;
