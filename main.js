enchant();
enchant.ENV.USE_TOUCH_TO_START_SCENE=false;

console.clear();

//ランダムな数値生成
var randint=function(min,max){
    return window.Math.floor(Math.random()*(max-min+1))+min;
};

var ARUSHIVU="./images/arushivu.png";
var KIRARA="./images/kirara.png";
var LAMP="./images/lamp.png";
var MACCHI="./images/macchi.png";
var MOB1="./images/mob1.png";
var MOB2="./images/mob2.png";
var MOB3="./images/mob3.png";
var MOB4="./images/mob4.png";

window.onload=function(){
    var game=new Core(320,320);
    game.fps=20;

    game.preload(ARUSHIVU);
    game.preload(KIRARA);
    game.preload(LAMP);
    game.preload(MACCHI);
    game.preload(MOB1);
    game.preload(MOB2);
    game.preload(MOB3);
    game.preload(MOB4);

    game.onload=function(){
        //ルートシーン
        var scene=game.rootScene;
        scene.backgroundColor="black";  //背景色

        //空のエンティティクラス
        var EmptyEntity=Class.create(Entity,{
            initialize:function(X,Y,width,height){
                Entity.call(this);
                this.moveTo(X,Y);
                this.width=width;
                this.height=height;
            },
            coloring:function(color,opacity){
                this.backgroundColor=color;
                this.opacity=opacity;
            }
        });

        //ウィンドウクラス
        var Window=Class.create(Group,{
            initialize:function(X,Y,width,height){
                Group.call(this);
                this.entity=new EmptyEntity(X,Y,width,height);
                this.entity.coloring("white",1);
                this.addChild(this.entity);
                this.entity2=new EmptyEntity(X+2,Y+2,width-4,height-4);
                this.entity2.coloring("black",1);
                this.addChild(this.entity2);
            },
            coloringFront:function(color,opacity){
                this.entity2.coloring(color,opacity);
            },
            coloringBack:function(color,opacity){
            	this.entity.coloring(color,opacity);
            }
        });

        //ゲームラベルクラス
        var GameLabel=Class.create(Label,{
            initialize:function(text,X,Y,px,color){
                Label.call(this,text);
                this.moveTo(X,Y);
                this.font=px+"px 'ＭＳ ゴシック','Consolas','Monaco'";
                this.color=color;
            }
        });

        //ゲームスプライトクラス
        var GameSprite=Class.create(Sprite,{
            initialize:function(X,Y,width,height,image){
                Sprite.call(this,width,height);
                this.image=game.assets[image];
                this.moveTo(X,Y);
            }
        });

        //点滅ラベルクラス
        var FlashingLabel=Class.create(GameLabel,{
          initialize:function(text,positionX,positionY,size,color){
            GameLabel.call(this,text,positionX,positionY,size,color);
            this.opacity=0.95;
            this.speed=-0.03;
          },
          onenterframe:function(){
            this.opacity+=this.speed;
            if(this.opacity<=0.25||this.opacity>=0.95){
              this.speed*=-1;
            }
          }
        });

        //タイトルシーン
        var TitleScene=Class.create(Group,{
          initialize:function(){
            Group.call(this);

            this.bg=new EmptyEntity(0,0,320,320);
            this.bg.coloring("black",1);
            this.addChild(this.bg);

            this.titleName=new GameLabel("ランプ",60,50,40,"#ffdddd");
            this.addChild(this.titleName);
            this.lamp=new GameSprite(180,54,32,32,LAMP);
            this.addChild(this.lamp);
            this.titleName2=new GameLabel("を探せ！",175,90,20,"white");
            this.addChild(this.titleName2);

            this.arushive=new GameSprite(110,150,32,32,ARUSHIVU);
            this.addChild(this.arushive);
            this.kirara=new GameSprite(180,150,32,32,KIRARA);
            this.addChild(this.kirara);
            this.macchi=new GameSprite(200,150,32,32,MACCHI);
            this.macchi.scale(0.5,0.5);
            this.addChild(this.macchi);

            this.addChild(new Window(110,210,100,25));
            this.addChild(new GameLabel("EASY",135,214,20,"white"));
            this.easyEntity=new EmptyEntity(110,210,100,25);
            this.addChild(this.easyEntity);
            this.easyEntity.ontouchstart=function(){
              this.parentNode.parentNode.removeChild(this.parentNode);
              scene.addChild(new FocusStageTitleScene(stageNum));
            }

            this.addChild(new Window(110,245,100,25));
            this.addChild(new GameLabel("NORMAL",125,249,20,"white"));
            this.normalEntity=new EmptyEntity(110,245,100,25);
            this.addChild(this.normalEntity);
            this.normalEntity.ontouchstart=function(){
              stageNum+=10;
              this.parentNode.parentNode.removeChild(this.parentNode);
              scene.addChild(new FocusStageTitleScene(stageNum));
            }

            this.addChild(new Window(110,280,100,25));
            this.addChild(new GameLabel("HARD",135,284,20,"white"));
            this.hardEntity=new EmptyEntity(110,280,100,25);
            this.addChild(this.hardEntity);
            this.hardEntity.ontouchstart=function(){
              stageNum+=20;
              this.parentNode.parentNode.removeChild(this.parentNode);
              scene.addChild(new FocusStageTitleScene(stageNum));
            }
          }
        });

        //ステージタイトルシーン
        var StageTitleScene=Class.create(Group,{
          initialize:function(){
            Group.call(this);

            this.bg=new EmptyEntity(0,0,320,320);
            this.bg.coloring("black",1);
            this.addChild(this.bg);

            this.levelLabel=new GameLabel("LEVEL?",40,15,20,"white");
            this.addChild(this.levelLabel);
            this.targetLabel=new GameLabel("Target:",150,35,20,"#ffdddd");
            this.addChild(this.targetLabel);
            this.lamp=new GameSprite(230,29,32,32,LAMP);
            this.addChild(this.lamp);

            this.arushive=new GameSprite(110,100,32,32,ARUSHIVU);
            this.addChild(this.arushive);
            this.kirara=new GameSprite(180,100,32,32,KIRARA);
            this.addChild(this.kirara);
            this.macchi=new GameSprite(200,100,32,32,MACCHI);
            this.macchi.scale(0.5,0.5);
            this.addChild(this.macchi);

            this.serifWindow=new Window(10,150,300,130);
            this.addChild(this.serifWindow);
            this.startLabel=new FlashingLabel("TOUCH",260,290,12,"white");
            this.addChild(this.startLabel);
            this.startEntity=new EmptyEntity(0,0,320,320);
            this.addChild(this.startEntity);
            this.startEntity.ontouchstart=function(){
              this.parentNode.parentNode.removeChild(this.parentNode);
              scene.addChild(this.parentNode.nextStage);
            }
          }
        });

        //フォーカスステージタイトルシーン
        var FocusStageTitleScene=Class.create(StageTitleScene,{
          initialize:function(num){
            StageTitleScene.call(this);

            this.nextStage=new FocusStageScene(num);
            this.levelLabel.text="LEVEL"+num;

            var serifPosition=158;
            var ra=randint(1,5);
            this.addChild(new GameLabel("アルシーヴ「",15,serifPosition,14,"white"));
            if(ra==1){
              this.addChild(new GameLabel("またランプが抜け出したのか...",100,serifPosition,14,"white"));
              this.addChild(new GameLabel("悪いが連れ戻してきてくれない",100,serifPosition+20,14,"white"));
              this.addChild(new GameLabel("か？」",100,serifPosition+40,14,"white"));
              serifPosition+=60;
            }
            else if(ra==2){
              this.addChild(new GameLabel("ランプが懲りずに抜け出したよ",100,serifPosition,14,"white"));
              this.addChild(new GameLabel("うだ。連れ戻してきてくれると",100,serifPosition+20,14,"white"));
              this.addChild(new GameLabel("助かる。」",100,serifPosition+40,14,"white"));
              serifPosition+=60;
            }
            else if(ra==3){
              this.addChild(new GameLabel("ランプがどこに行ったか知らな",100,serifPosition,14,"white"));
              this.addChild(new GameLabel("いか？これから大事な話がある",100,serifPosition+20,14,"white"));
              this.addChild(new GameLabel("のだが...」",100,serifPosition+40,14,"white"));
              serifPosition+=60;
            }
            else if(ra==4){
              this.addChild(new GameLabel("ジンジャーがランプを探してい",100,serifPosition,14,"white"));
              this.addChild(new GameLabel("るのだが、どこに行ったか知ら",100,serifPosition+20,14,"white"));
              this.addChild(new GameLabel("ないか？」",100,serifPosition+40,14,"white"));
              serifPosition+=60;
            }
            else if(ra==5){
              this.addChild(new GameLabel("何度も何度もすまない。またラ",100,serifPosition,14,"white"));
              this.addChild(new GameLabel("ンプをここに連れてきてくれな",100,serifPosition+20,14,"white"));
              this.addChild(new GameLabel("いか？」",100,serifPosition+40,14,"white"));
              serifPosition+=60;
            }

            var macchiSerifs=[
              "マッチ「しょうがないなー...」","マッチ「やれやれ。」","マッチ「僕がいないと、ダメみたいだね。」",
              "マッチ「全くランプには困ったものだよ。」","マッチ「これは貸しだからね。」","マッチ「すぐに見つけてきてあげるよ。」",
              "マッチ「めんどくさいなー...」"
            ];
            this.addChild(new GameLabel(macchiSerifs[randint(0,macchiSerifs.length-1)],15,serifPosition,14,"white"));
            serifPosition+=20;

            this.addChild(new GameLabel("アルシーヴ「"+stageTime[num-1]+"秒以内で頼む。」",15,serifPosition,14,"white"));
          }
        });

        //キャラクター
        var Chara=Class.create(Group,{
          initialize:function(positionY){
            Group.call(this);

            var images=[MOB1,MOB2,MOB3,MOB4];
            this.sprite=new GameSprite(0,0,32,32,images[randint(0,3)]);
            this.addChild(this.sprite);

            this.y=positionY;

            var r=randint(0,99);
            if(r<60){
              this.motion=1;
              this.x=randint(-32,320);
            }
            else if(r<80){
              this.motion=2;
              this.x=randint(-16,320-16);
              this.tl.delay(randint(1,9)*0.1*game.fps);
              this.tl.delay(randint(5,15)*0.1*game.fps).moveBy(0,-5,0.2*game.fps).moveBy(0,5,0.2*game.fps).loop();
            }
            else{
              this.motion=0;
              this.x=randint(-16,320-16);
            }
            this.speed=randint(1,5)*(randint(0,1)===0?1:-1);
            this.stopMotionFlag=false;
          },
          changeMotion:function(){
            if(this.motion==2){
              return;
            }
            var r=randint(0,99);
            if(r<75){
              this.motion=1;
            }
            else if(this.x>=-16&&this.x<=320-16){
              this.motion=0;
            }
          },
          onenterframe:function(){
            if(this.stopMotionFlag){
              return;
            }

            if(this.motion==1){
              this.x+=this.speed;
              if(this.x<-32){
                this.x=-32;
                this.speed*=-1;
              }
              else if(this.x>320){
                this.x=320;
                this.speed*=-1;
              }
            }

            var r=randint(0,99);
            if(r<2){
              this.changeMotion();
            }

            if(this.frontEntity!==undefined){
              this.frontEntity.x=this.x;
            }
          }
        });

        //ランプ
        var Lamp=Class.create(Chara,{
          initialize:function(positionY){
            Chara.call(this,positionY);
            var that=this;

            this.sprite.image=game.assets[LAMP];
            this.entity=new EmptyEntity(0,0,32,32);
            // this.entity.coloring("red",0.4);
            this.addChild(this.entity);
            this.entity.ontouchstart=function(){
              this.parentNode.touchedTarget();
              this.parentNode.parentNode.removeChild(this.parentNode.frontEntity);
              this.parentNode.removeChild(this);
            };
            this.frontEntity=new EmptyEntity(0,this.y,32,32);
            // this.frontEntity.coloring("blue",0.4);
            this.frontEntity.ontouchstart=function(){
              that.touchedTarget();
              that.removeChild(that.entity);
              this.parentNode.removeChild(this);
            };
          },
          touchedTarget:function(){
            this.tl.unloop().clear();
            this.speed=0;
            this.stopMotionFlag=true;
            this.parentNode.timer=-1;
            this.parentNode.removeChild(this.parentNode.timerLabel);

            this.macchi=new GameSprite(0,0,32,32,MACCHI);
            this.macchi.scale(0.5,0.5);
            this.macchi.moveBy(0,-this.y-32);
            this.addChild(this.macchi);
            this.macchi.tl.moveTo(0,-12,0.7*game.fps).then(()=>{
              this.leaveChara();
            });
            this.serif=new GameLabel("いやああぁぁ！！",32,8,16,"black");
            this.serif.opacity=0;
            this.addChild(this.serif);
          },
          leaveChara:function(){
            this.tl.moveTo(this.x,8,0.7*game.fps).then(()=>{
              this.serif.opacity=1;
            }).moveTo(-160,8,1.3*game.fps).then(()=>{
              this.parentNode.showResult();
            }).delay(2*game.fps).then(()=>{
              this.parentNode.endStage();
            });
          }
        });

        //ステージシーン
        var StageScene=Class.create(Group,{
          initialize:function(){
            Group.call(this);

            this.skyBg=new EmptyEntity(0,0,320,60);
            this.skyBg.coloring("#ddf0ff",1);
            this.addChild(this.skyBg);
            this.groundBg=new EmptyEntity(0,60,320,260);
            this.groundBg.coloring("#bbf099",1);
            this.addChild(this.groundBg);

            this.lampFlag=false;

            this.timer=-1;
            this.timerLabel=new GameLabel("",280,8,16,"black");
            this.addChild(this.timerLabel);
          },
          addChara:function(num){
            var charas=[...Array(num)].map(()=>randint(40,320-16)).sort((a,b)=>a-b);
            this.lampPos=(this.lampFlag?randint(0,num-1):-1);
            var lamp=null;

            charas.map((positionY,index)=>{
              if(this.lampPos==index){
                lamp=new Lamp(positionY);
                this.addChild(lamp);
              }
              else{
                this.addChild(new Chara(positionY));
              }
            });

            if(lamp!==null){
              this.addChild(lamp.frontEntity);
            }
          },
          showResult:function(){
            this.arushiveBg=new EmptyEntity(200-10,0,130,48);
            this.arushiveBg.coloring("black",1);
            this.addChild(this.arushiveBg);
            this.arushive=new GameSprite(0,0,32,32,ARUSHIVU);
            this.arushive.moveTo(320-40,8);
            this.addChild(this.arushive);
            this.arushiveSerif=new GameLabel("よくやった",200,16,16,"white");
            this.addChild(this.arushiveSerif);
          },
          endStage:function(){
            this.parentNode.removeChild(this);
            stageNum++;
            if((stageNum-1)%10===0){
              scene.addChild(new GameclearScene(stageNum));
            }
            else{
              scene.addChild(new FocusStageTitleScene(stageNum));
            }
          },
          onenterframe:function(){
            if(this.timer<=0){
              return;
            }
            this.timer--;
            this.timerLabel.text=Math.floor((this.timer/game.fps)*10)/10;
            if(this.timer===0){
              this.parentNode.removeChild(this);
              scene.addChild(new GameoverScene());
            }
          }
        });

        //フォーカスステージシーン
        var FocusStageScene=Class.create(StageScene,{
          initialize:function(num){
            StageScene.call(this);

            if(num>=1){
              this.lampFlag=true;
            }

            this.addChara(stageCharaNum[num-1]);
            this.timer=stageTime[num-1]*game.fps;
          }
        });

        //ゲームオーバーシーン
        var GameoverScene=Class.create(Group,{
          initialize:function(){
            Group.call(this);

            this.skyBg=new EmptyEntity(0,0,320,60);
            this.skyBg.coloring("#ddf0ff",1);
            this.addChild(this.skyBg);
            this.groundBg=new EmptyEntity(0,60,320,260);
            this.groundBg.coloring("#bbf099",1);
            this.addChild(this.groundBg);

            this.gameoverLabel=new GameLabel("GAME OVER",50,16,16,"red");
            this.addChild(this.gameoverLabel);
            this.stageLabel=new GameLabel("ステージクリア数："+((stageNum-1)%10),50,40,16,"black");
            this.addChild(this.stageLabel);

            this.lamp=new GameSprite(160-16,160,32,32,LAMP);
            this.addChild(this.lamp);
            this.addChild(new GameLabel("ようやくマッチから逃げ切れたー",30,210,16,"black"));
            this.addChild(new GameLabel("早くクリエメイトのみなさまの所へ",30,230,16,"black"));
            this.addChild(new GameLabel("行かないと！",30,250,16,"black"));

            this.entity=new EmptyEntity(0,0,320,320);
            this.entity.ontouchstart=function(){
              this.parentNode.parentNode.removeChild(this.parentNode);
              stageNum=1;
              scene.addChild(new TitleScene());
            };

            this.tl.delay(0.5*game.fps).then(()=>{
              this.addChild(this.entity);
            });
          }
        });

        //ゲームクリアーシーン
        var GameclearScene=Class.create(Group,{
          initialize:function(){
            Group.call(this);

            this.skyBg=new EmptyEntity(0,0,320,60);
            this.skyBg.coloring("#ddf0ff",1);
            this.addChild(this.skyBg);
            this.groundBg=new EmptyEntity(0,60,320,260);
            this.groundBg.coloring("#bbf099",1);
            this.addChild(this.groundBg);

            this.addChild(new GameLabel("GAME CLEAR",50,16,16,"blue"));
            this.stageLabel=new GameLabel("ステージクリア数："+(((stageNum-2)%10)+1),50,40,16,"black");
            this.addChild(this.stageLabel);

            this.arushive=new GameSprite(120,160,32,32,ARUSHIVU);
            this.addChild(this.arushive);
            this.addChild(new GameLabel("さあ、行くぞ",40,140,16,"black"));
            this.macchi=new GameSprite(200,100,32,32,MACCHI);
            this.macchi.scale(0.5,0.5);
            this.addChild(this.macchi);
            this.kirara=new GameSprite(180,100,32,32,KIRARA);
            this.addChild(this.kirara);
            this.addChild(new GameLabel("あはは...",190,80,16,"black"));

            this.lamp=new GameSprite(160-16,160,32,32,LAMP);
            this.addChild(this.lamp);
            this.addChild(new GameLabel("いやああぁぁ！！！",110,210,16,"black"));
            this.addChild(new GameLabel("クリエメイトのみなさまが",110,230,16,"black"));
            this.addChild(new GameLabel("私を待っているんですー！",110,250,16,"black"));

            this.entity=new EmptyEntity(0,0,320,320);
            this.entity.ontouchstart=function(){
              this.parentNode.parentNode.removeChild(this.parentNode);
              stageNum=1;
              scene.addChild(new TitleScene());
            };

            this.tl.delay(0.5*game.fps).then(()=>{
              this.addChild(this.entity);
            });
          }
        });

        var stageCharaNum=[
          50,60,70,80,90,100,110,120,130,140,
          100,120,140,160,180,200,220,240,260,280,
          300,330,360,390,420,450,480,510,540,570
        ];
        var stageTime=[
          10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,
          7.7,7.4,7.1,6.8,6.5,6.2,5.9,5.6,5.3,5,
          6.8,6.5,6.2,5.9,5.7,5.5,5.3,5.2,5.1,5
        ];
        var stageNum=1;

        scene.addChild(new TitleScene());
        // scene.addChild(new FocusStageTitleScene(stageNum));
        // scene.addChild(new FocusStageScene(stageNum));
        // scene.addChild(new GameclearScene());
    };
    game.start();
};
