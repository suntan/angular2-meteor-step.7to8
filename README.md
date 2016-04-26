# angular2-meteor-step.7to8
安裝 Meteor 指令如下:

$ curl https://install.meteor.com/ | sh

下載範例到專案根目錄，以　/usr/src 為例，並變更專案名稱 (以 my-app 為例 )，輸入指令如下 :

$ cd /usr/scr

$ git clone https://github.com/suntan/angular2-meteor-step.7to8.git

$ mv angular2-meteor-step.7to8 my-app

$ cd my-app

$ meteor add angular2-compilers

$ meteor npm install --save angular2-meteor

$ meteor npm install --save meteor-node-stubs

$ meteor remove blaze-html-templates

$ npm install typings -g

$ typings install es6-promise

$ typings install es6-shim --ambient

$ meteor npm install angular2-meteor-auto-bootstrap --save

$ meteor remove insecure

$ meteor add accounts-password

$ meteor npm install --save angular2-meteor-accounts-ui


用自己喜歡的 port 啟動(以下用1688為例)，輸入指令如下:

$ meteor -p  1688

=============================================================================================

# Step 7 - Folder structure 

1.	本節對前面我們實作的應用作一次檢視。

2.	剖析了解一下TypeScript ，作為此解決方案的主要語言，對他了解得越多對我們接下來的開發相信是有幫助的。

# File Structure – 檔案結構

在前面我們開發應用程序的過程中，其實在應用程序透過 meteor -p <port>指令啟動後，我們無須開開關關，而是可以在啟動的狀態下直接進行開發 (套件安裝或變更package.json套件設定除外)；我們撰寫的不是 Javascript而是TypeScript，而我們在編寫 *.ts 檔案時會被 Meteor 自動編譯成 CommonJS 獨立 Model ; 更精確地說Meteor偵測的整個專案有關 *.js、*.ts、*.css、*.json、*.html (後面還會介紹如何使用 jade、less套件來管理樣式與模版 )，且每一個CommomJS Model都是嚴謹的組件，在需要的時候引入就可使用。

Meteor 專案下有server、client 這兩個特殊的資料夾，兩者分別對應 server-side與client-side；是不相互影響的，而且兩邊的開發方式是一樣的。而在專案根目錄下另建的資料夾與其內的CommomJS Model則可供兩端同時呼叫操作使用，如我們在實例中使用的Parties資料模型 (Data-Model) 。

# TypeScript
可能個人習慣的原因，我還是習慣使用terminal + vim來作開發，微軟開發的這套語言我想應該是繼C#後的另一個高峰，順帶一題有些IDE已經整合了TypeScript，如 : Visual Studio, WebStorm, Sublime, Atom, etc . . .等。遠程(Remote)開發若是不想像我一樣用terminal + vim，推薦人最多的是WebStorm, Sublime。

微軟有了C#語言研發經驗，所以TypeScript具備強型別的特性；雖然在Javscript的世界要實現OOP已經有很多解決方案，但是微軟還是很努力地加強這套語言型別檢查，讓它更適合應用於大型OOP專案。型別檢查機制，會使我們在撰寫程式時更不容易出錯。這只是在我們的開發環境下產生作用，前端瀏覽器仍然是執行編譯後的Javascript，因此並不會造成用戶載體多餘的負擔。
相信它會是繼承Javascript 的靈活特性，又方便使用的語言。

# Type Declaration Files – 檔案類型宣告

為何我們可以在TypeScript 中使用 Angular2 及 Meteor ，這是我們在 Step 1. 時進行配置的事情，它的關鍵在於參考了angular2.d.ts 與 meteor.d.ts 。

如果下載了 meteor 專案而無法執行時，請詳細檢查tscongig.json 的設定，如發現typings資料夾內缺少套件可以在專案根目錄下使用 typings install <套件名稱> 來手動安裝，另外個人還是習慣使用 npm 來進行套件的管理，參考 angular2 官網修正 package.json 檔案如下 :

{

  "name": "socially",
  
  "private": true,
  
  "scripts": {
  
    "start": "meteor run"
    
  },
  
  "dependencies": {
  
    "angular2": "^2.0.0-beta.15",
    
    "angular2-meteor": "^0.5.3",
    
    "angular2-meteor-auto-bootstrap": "^0.5.2",
    
    "es6-shim": "^0.35.0",
    
    "meteor-node-stubs": "^0.2.3",
    
    "reflect-metadata": "^0.1.2",
    
    "rxjs": "^5.0.0-beta.2",
    
    "zone.js": "^0.6.12"
    
  },
  
  "exclude": [
  
    "node_modules",
    
    "typings/main",
    
    "typings/main.d.ts"
    
  ]
  
}

# Custom Type Declaration File - - 自定義型別檔案宣告

我們來修正的Party 這個Data-Model 避免泛型的潛在錯誤，新增typins/party.d.ts 檔案並寫入以下內容:

interface Party {

  _id?: string;
  
  name: string;
  
  description?: string;
  
  location: string;
  
}

然後編輯tsconfig.json檔案，加入 party.d.ts 自定義型別設定如下:

……
    "sourceMap": true
    
  },
  
  "files": [
  
    "typings/main.d.ts",
    
    "typings/angular2-meteor/angular2-meteor.d.ts",
    
    "typings/party.d.ts"
    
  ]
  
}

修改有使用到 parties collection 的所有檔案，開啟 collections/parties.ts 修改如下 :

import {Mongo} from 'meteor/mongo';

export var Parties = new Mongo.Collection<Party>('parties');

修改 client/imports/parties-list/parties-list.ts與/client/imports/party-details/party-details.ts 檔案將 Object 型別換成 Party :

  directives: [PartiesForm, RouterLink]
  
})

export class PartiesList {

  parties: Mongo.Cursor<Party>;
 
  constructor() {
  
    this.parties = Parties.find();

/client/imports/party-details/party-details.ts :

export class PartyDetails {

  party: Party;
  
  constructor(params: RouteParams) {
  
    var partyId = params.get('partyId');
    
    this.party = Parties.findOne(partyId);
    
  }

使用 meteor -p <port> 指令並開啟瀏覽器來進行測試。

# IDE Specific Configurations – 開發工具的特殊設定

部分IDE 中，如 Atom 會在 tsconfig.json 中寫入如下filesGlob設定來加載所有的 *.ts 宣告:

{

 "atom": {
 
    "rewriteTsconfig": true
    
  },
  
  "compileOnSave": false,
  
  "buildOnSave": false,
  
  "compilerOptions": {
  
    "target": "es5",
    
    "module": "commonjs",
    
    "moduleResolution": "classic",
    
    "experimentalDecorators": true
    
  },
  
  "filesGlob": [
  
    "**/*.ts"
    
  ],
  
  "files": []
  
}

# Summary – 概要說明

1.	明白如何修改tsconfig.json來加載其他 APIs。

2.	如何宣告並載入自定義型別介面，使程式更不易出錯。

# Step 8 - User accounts, authentication and permissions – 使用者帳戶、帳戶驗證、權限管理

本節將進行以下動作 :

1.	合併使用 Angular 2與Meteor的安全性機制。

2.	使用 Meteor的Account UI套件。

3.	配置 Party 資料模型的安全檢查機制。

4.	使用者存取權限的設定。

# Removing Insecure – 移除Insecure 套件

在預設的情況下Meteor 包含 Insecure 套件，它的預設設定使我們在前面的過程中可以很方便的操作資料模型，但是現在我們不希望任何用戶都可以隨意操作它。
可操作資料的使用者應該要具備如下條件 :

1.	使用者在登入狀態下才可以進行資料新增 & 刪除

2.	資料是該使用者建立的資料才可進行編輯

於專案根目錄下，執行如下指令 :

$ meteor remove insecure

現在如執行應用，會發現除了 Data-Bind以外，其他對資料的操作行為，如新增、編輯、刪除的功都失效了。

# User Accounts – 使用者帳戶

我們在此介紹Meteor 內建的Meteor accounts系統  - "accounts-password" 套件，它本身整合了登錄、註冊、修改密碼、找回密碼、電子郵件確認等功能。載入該套件，於專案根目錄輸入指令如下:

$ meteor add accounts-password

執行完畢可看到如下訊息 :

Changes to your project's package version selections:

accounts-base          added, version 1.2.7

accounts-password      added, version 1.1.8

ddp-rate-limiter        added, version 1.0.4

email                added, version 1.0.12

localstorage           added, version 1.0.9

npm-bcrypt           added, version 0.8.5

rate-limit             added, version 1.0.4

service-configuration    added, version 1.0.9

sha                  added, version 1.0.7

srp                  added, version 1.0.8

accounts-password: Password support for accounts

如果今天是單純的 Meteor 專案而不加入Angular 2，下一步應該是增加"accounts-ui"套件，而該套件的樣板引擎是使用 Blaze-related (於Step 0.已移除)，所以在此使用 angular2-meteor-accounts-ui 套件來替換，輸入以下指令進行載入 :

$ meteor npm install --save angular2-meteor-accounts-ui

PS : 
執行上述動作後，專案根目錄下看起並沒有什麼差異，詳細看一下上述指令 angular2-meteor-accounts-ui 已載入到 node_modules/angular2-meteor-accounts-ui 中。有時間建議可以到此目錄下瞭解一下人家如何製作UI、功能套件相信以後的開發之路會走得更遠。競爭靠的是本事，大家都懂的東西叫常識；能人所不能才叫本事! 額外研究課題 :

1.	了解 accounts-password 套件與angular2-meteor-accounts-ui套件的對照關係

2.	準備好github帳號，嘗試開發NPM套件

編輯 client/imports/parties-list/parties-list.html 檔案，加入<login-buttons> 組件標籤 :

<div>

  <parties-form></parties-form>
  
  <login-buttons></login-buttons>
  
  <ul>
  
    <li *ngFor="#party of parties"> 
    
. . .

編輯 client/imports/parties-list/parties-list.ts檔案，載入angular2-meteor-accounts-ui/login-buttons 組件 :

import 'reflect-metadata';

import {Component} from 'angular2/core';

import {Parties} from '../../../collections/parties';

import {PartiesForm} from '../parties-form/parties-form';

import {RouterLink} from 'angular2/router';

import {LoginButtons} from 'angular2-meteor-accounts-ui/login-buttons';

@Component({

  selector: 'parties-list',
  
  templateUrl: '/client/imports/parties-list/parties-list.html',
  
  directives: [PartiesForm, RouterLink, LoginButtons]
  
})
export class PartiesList {

  parties: Mongo.Cursor<Party>;

  constructor() {
  
    this.parties = Parties.find();
    
  }

  removeParty(party) {
  
    Parties.remove(party._id);
    
  }
  
}

已嵌入簡易的帳戶系統，啟動專案並開啟瀏覽器進行測試。

# Parties.allow()

建立Parties 操作的安全規則(security rules)，編輯 collections/parties.ts 檔案如下 :

import {Mongo} from 'meteor/mongo';

export var Parties = new Mongo.Collection<Party>('parties');

Parties.allow({

  insert: function() {
  
    var user = Meteor.user();
    
    return !!user;
    
  },
  
  update: function() {
  
    var user = Meteor.user();
    
    return !!user;
  },
  
  remove: function() {
  
    var user = Meteor.user();
    
    return !!user;
    
  }
  
});

我們已定義好在使用者登入時操作 Parties資料模型的規則，如果要更深入了解 Meteor docs on allow 的介紹請參考 : http://docs.meteor.com/#/full/allow 

# Meteor.user()

為了確保 praty 資料的建立者(擁有者)，才能進行該資料的操作，首先我們必須在 party資料建立時增加一個owner欄位，以下將利用Meteor 的 accounts 套件提供的Meteor.user() 及 Meteor.userId()方法，首先修改 typings/party.d.ts 檔案 :

interface Party {

  _id?: string;
  
  name: string;
  
  description?: string;
  
  location: string;
  
  owner?: string;
  
}

再來於party資料建立時帶入Meteor.userId()設定及登入狀態判斷，修改 client/imports/parties-form/parties-form.ts 檔案如下 :

  addParty(party) {
  
    if (this.partiesForm.valid) {
    
      if (Meteor.userId()) {
      
        Parties.insert({
        
          name: party.name,
          
          description: party.description,
          
          location: party.location,
          
          owner: Meteor.userId()
          
        }); 
        
        (<Control>this.partiesForm.controls['name']).updateValue('');
        
        (<Control>this.partiesForm.controls['description']).updateValue('');
        
        (<Control>this.partiesForm.controls['location']).updateValue('');
        
      } else {
      
        alert('Please log in to add a party');
        
      }
      
    }
    
  }

於 party資料編輯儲存時加入資料擁有者判斷 ，修改 client/imports/party-details/party-details.ts 檔案如下 :

  saveParty(party) {
  
     if (Meteor.userId()) {
     
        Parties.update(party._id, {
        
          $set: {
          
            name: party.name,
            
            description: party.description,
            
            location: party.location
            
          }
          
        });
        
     } else {
     
      alert('Please log in to change this party');
      
     }
     
    }

# RequireUser 
除了上述的作法外，其實還可以更簡單，Meteor Accounts API提供了兩個annotation : InjectUser 、RequireUser；我們也可以修改 client/imports/party-details/party-details.ts 檔案使用 @RequireUser annotation 來修飾整個Componet 以進行登入檢查 :

import 'reflect-metadata';

import {Component} from 'angular2/core';

import {RouteParams} from 'angular2/router';

import {Parties} from '../../../collections/parties';

import {RouterLink} from 'angular2/router';

import {RequireUser} from 'angular2-meteor-accounts-ui';

@Component({

  selector: 'party-details',
  
  templateUrl: '/client/imports/party-details/party-details.html',
  
  directives: [RouterLink]
  
})

@RequireUser()

export class PartyDetails {

  party: Party;

# InjectUser 

修改 client/imports/parties-form/parties-form.ts 檔案，注入 User 屬性如下 :
...
import {MeteorComponent} from 'angular2-meteor';

import {InjectUser} from 'angular2-meteor-accounts-ui';

@Component({

  selector: 'parties-form',
  
  templateUrl: 'client/parties-form/parties-form.html',
  
})

@InjectUser()

export class PartiesForm extends MeteorComponent {

  user: Meteor.User;
  
  constructor() {
  
    super();
    
    ...
    
    console.log(this.user);
    
  }
  
  ...
  
}

關於MeteorComponent 我們會在下一節進行介紹它的pub/sub資料傳輸，以及使用它來偵測server-side的訊息，現在我透過上述的修改，使 PratiesForm 繼承 MeteorComponent 的特性，我們已經讓PartiesForm繼承 MeteorComponent組件的特性，並解透過@InjectUser修飾注入定義了 user 區域變數，接下來修改 client/imports/parties-form/parties-form.html如下來測試在View中的工作情況 :

<div *ngIf="!user">Please, log in to change party</div>

<form [ngFormModel]="partiesForm" #f="form" (submit)="addParty(f.value)">

  ...
  
</form>

上述內容中，我們使用了Angular2/common中的 ngIf 屬性來判斷使用者目前是否登入，如果回傳false 則會show出此<div>標籤及內容。

# Routing Permissions –權限路由

接下來我們將替換@RequireUser為@CanActivate並帶入checkPermissions方法來建立以下檢查工作:

1.	存取路由是否帶有 :partyId。

2.	如果帶有 partyId ，則找出這筆party資料，檢查資料本身與資料擁有者party.owner 與Meteor.userId() 是否相等，如果是才允許編輯這筆party資料。
修改 client/imports/party-details/party-details.ts 檔案如下 :
…
import {RequireUser} from 'angular2-meteor-accounts-ui';

import {CanActivate, ComponentInstruction} from 'angular2/router';

function checkPermissions(instruction: ComponentInstruction) {

  var partyId = instruction.params['partyId'];
  
  var party = Parties.findOne(partyId);
  
  return (party && party.owner == Meteor.userId());
  
}

@Component({

  selector: 'party-details',
  
  templateUrl: '/client/imports/party-details/party-details.html',
  
  directives: [RouterLink]
  
})

/* @RequireUser() */

@CanActivate(checkPermissions)

export class PartyDetails {

  party: Party;

現在啟動應用進行註冊、登入、登出、新建幾筆資料、編輯資料；可以發現如果非登入狀態無法新增&刪除資料，非該資料擁有者無法進入該資料編輯頁面。

# Summary – 概要說明
1.	實作使用 meteor 套件accounts-ui套件。
2.	初識 MeteorComponent，並操作基本的 annotation。
3.	實務調整操作資料模型的安全規則規則。
