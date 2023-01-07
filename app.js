

			//Budjet Controller module
			
			var budgetcontroller= (function(){
				
				var Expenses = function( id, desc, val)
				{
					this.id= id;
					this.desc=desc;
					this.val = val;
					this.per=-1;
				};

				Expenses.prototype.calcPercentages =  function(totalInc)
				{
					this.per= Math.round((this.val/totalInc)*100);
				}

				Expenses.prototype.getPercentage = function()
				{
					return this.per;
				}



				var Income = function( id, desc, val)
				{
					this.id= id;
					this.desc=desc;
					this.val = val;

				};
				
				var DataItems={
					inc: [],
					exp: [],
					
				};
				var Total={
					inc:0,
					exp:0,
					budget:0,
					per:0
				}

				

				return{

					getTotal: function()
					{
						
						Total.budget= Total.inc-Total.exp;
						Total.inc>0 ? Total.per= Math.round((Total.exp/Total.inc) *100) : Total.per=0;
						return Total;
						
					
					},

					getPersCalcs: function () {
						
						DataItems.exp.forEach(function (params) {
							params.calcPercentages(Total.inc)
						});
						
					},

					getPers:function () {
						var pers= DataItems.exp.map(function (params) {
							return params.getPercentage();
							
						});

						return pers;
					},

					addnewItem : function(type,desc,value)
					{
						var newItem,ID;

						if(DataItems[type].length>0)
						{
							ID= DataItems[type][DataItems[type].length-1].id+1;
						}
						else
						{
							ID=0;
						}
						if(type==='exp')
						{
							newItem= new Expenses(ID,desc,value);
					
						
						}
						else if(type==='inc')
						{
							newItem= new Income(ID,desc,value);
						}
						DataItems[type].push(newItem);
						Total[type]+=value;
						return newItem;
					}
					,
					getCounts: function()
					{
						return Total;
					},

					removeItem: function(type,id)
					{
						var index=DataItems[type].map(function(curr)
						{
							return curr.id;
						}
						);

						var ind= index.indexOf(id);

						var val1 = DataItems[type][ind].val;
						Total[type]-=val1;
						
						if(ind!== -1)
						{
							DataItems[type].splice(ind,1);
						}

					}
				}
				
			})();
			
			
			//UI Module
			
			var uiModule = (function(){
				
				var DomStrings = {

					itype: '.add__type',
					idesc: '.add__description',
					ival: '.add__value',
					ibtn : '.add__btn',
					Income: '.income__list',
					Expenses: '.expenses__list'
				};

				var formatNumber = function(num, type) {
					var numSplit, int, dec, type;
					/*
						+ or - before number
						exactly 2 decimal points
						comma separating the thousands
			
						2310.4567 -> + 2,310.46
						2000 -> + 2,000.00
						*/
			
					num = Math.abs(num);
					num = num.toFixed(2);
			
					numSplit = num.split('.');
			
					int = numSplit[0];
					if (int.length > 3) {
						int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
					}
			
					dec = numSplit[1];
			
					return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
			
				};

				return {
					
					updateExpenses: function (params) {
						var list = document.querySelectorAll('.item__percentage');
						
						nodeForEachList = function (list1, callBack) {
							for(var i=0; i<list1.length;i++)
							{
								callBack(list1[i].textContent= params[ind]+ '%');
							}
						}

						nodeForEachList(list,function (curr, ind) {
							curr.textContent= params[ind] + '%';
						}); 
							
							
						
					},

					getInput : function(){
					return{
					type: document.querySelector(DomStrings.itype).value,
					description: document.querySelector(DomStrings.idesc).value,
					num : parseFloat(document.querySelector(DomStrings.ival).value)
					}
					},

					getDoms : function()
					{
						return DomStrings;
					},

					addModule:function(obj, type)
					{
						var element;
						//create an html string
						// replace placeholders
						// add item to dom
						var html,newHtml;
						if(type==='exp')
						{
							element= DomStrings.Expenses;
							html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">  <div class="item__value">%value%</div>  <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'

						}
						else if(type==='inc')
						{
							element=DomStrings.Income;
							html=' <div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn">   <i class="ion-ios-close-outline"></i> </button> </div></div> </div>'

						}

						newHtml= html.replace('%id%',obj.id);
						newHtml= newHtml.replace('%description%',obj.desc);
						newHtml= newHtml.replace('%value%',formatNumber(obj.val,type));

						document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
					}
					,
					updateFields: function(item)
					{
						var B1=0;
						//use innerHtml for div
						if(item.budget>0)
						{
							 B1= '+' + item.budget;
						}
						else
						{
							B1= '-' + item.budget;
						}
						
						document.querySelector('.budget__value').innerHTML=item.budget;
						
						item.inc>0 ? document.querySelector('.budget__income--value').innerHTML= '+' + item.inc : document.querySelector('.budget__income--value').innerHTML= item.inc;
						
						item.exp>0? document.querySelector('.budget__expenses--value').innerHTML= '-' + item.exp : document.querySelector('.budget__expenses--value').innerHTML=  item.exp


						if(item.per>0)
						document.querySelector('.budget__expenses--percentage').innerHTML=item.per+'%';
						else
						{
							document.querySelector('.budget__expenses--percentage').innerHTML='---';
						}
						
						document.querySelector(DomStrings.ival).value='';
						document.querySelector(DomStrings.idesc).value='';
						
					},
	
					 deleteItem : function(id)
					{
						var el= document.getElementById(id);
						el.parentNode.removeChild(el);
					},
					
					displayMonth:function () {

						var now = new Date();
						var year= now.getFullYear();
						var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
						var month = now.getMonth();
						document.querySelector('.budget__title--month').innerHTML= months[month] + ' ' + year;
						
					}

					
				};
				
				
			})();
			
			
			// Intermediate
			
			var communicator = (function(bctrl,uctrl){
				
				var Dom= uiModule.getDoms();

				var upDateBudget= function()
				{
					// Caculate budget 
					
					var budgetBack=budgetcontroller.getTotal();
					//return budget 
					// display budget on UI
					uiModule.updateFields(budgetBack);

				}

				var ctrlBudget = function()
				{
					var input = uiModule.getInput();
			
					if(input.description !=="" && input.num>0 && !isNaN(input.num))
					{
						var newItem = budgetcontroller.addnewItem(input.type,input.description,input.num);

						uiModule.addModule(newItem,input.type);
						upDateBudget();
						
						budgetcontroller.getPersCalcs();
						var expenses_per = budgetcontroller.getPers();
						uiModule.updateExpenses(expenses_per);
					}
					
				}
				
			
				var DelItem = function(event)
				{
					var nid,Id,type,itemId;
					
					itemId= event.target.parentNode.parentNode.parentNode.parentNode.id;
					

					if(itemId)
					{
						nid= itemId.split('-');
						Id= parseInt(nid[1]);

						type=nid[0];
						budgetcontroller.removeItem(type,Id);
						uiModule.deleteItem(itemId);
						uiModule.updateFields(budgetcontroller.getTotal());
					}

				}

				document.querySelector('.container').addEventListener('click',DelItem);

				document.querySelector(Dom.ibtn).addEventListener('click',ctrlBudget);
				
				document.querySelector('keypress',function(event){
					
					if(event.keycode===13 || event.which === 13)
						ctrlBudget();
					
				}
				);
				
				return{

					init:function()
					{
						var obj=
						{
							budget:0,
							inc:0,
							exp:0,
							per:0
						}
						uiModule.updateFields(obj);
						debugger;
						uiModule.displayMonth();
					}

				}
				
			})();
			
	communicator.init();