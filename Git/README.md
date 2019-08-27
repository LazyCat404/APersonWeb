#####GIT的安装与配置
- 如果第一次是用git可以去[官网](https://git-scm.com/)下载安装
- 安装好后可以在桌面右键点击，可以发现右键菜单中多出两个选项
![](https://upload-images.jianshu.io/upload_images/17728182-229c70a197d6c93e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 点击 **Git Bush Here** 则可以进入命令行工具，运行我们的 git 命令 ；但git bush here 命令行工具是linux风格，如果习惯使用Windows下的命令行，也同样可以使用。
- 在第一次使用git 工具时需要配置用户名和密码，打开命令行工具，执行以下操作：
```
git config --global user.name "username"
git config --global user.email "***@**.**"
```
提示输入密码（两次）时，所输入的密码并不会显示出来，输入完回车即可。
#####GIT的基本命令
与远程仓库建立连接
```
git remote add origin git@github.com……
```
将远程仓库克隆到本地
```
git clone git@githun.com……
```
基础命令
```
git init		                 创建本地git 仓库
git status   	                 查看仓库状态
git add . 		                 将同目录下的文件添加到git存储
git commit -m "提交提示"    	  将本地git存储提交到git仓库 
git push --force origin master   将git仓库内容提交到远程，
git pull	                     将远程仓库更新到本地
git clone	                     将远程仓库克隆到本地
git branch		                 查看分支（本地）
git branch -r	                 查看远程分支（需要先将远程拉取到本地）
git checkout -track 分支名        同查看到的远程分支一样
git branch 分知名		           新建分支
git checkout 分支名 		       切换分支
git checkout -b 分知名	           新建并运行分支（相当于执行上两句）
git push origin :分支名	       删除远程分支
git branch -D 分知名		       删除本地分支
```
将本地分支与远程分支建立连接
```
git branch --set-upstream-to=origin/本地分支名 远程分支名
```
#####常见问题
1.你可能遇到无法推送到远程仓库的情况（可能需要拉取），对于新手，这里交大家一个简单粗暴关键是有用的方法！！
```
git push -f origin master
```
执行上边的命令，将本地仓库强行推送到远程，如果你使用的是VSCode可用通过它的git管理功能，通过点击‘拉去自……’将远程仓库内容更新到本地。
2.无法从远程拉去
![拉取错误](https://upload-images.jianshu.io/upload_images/17728182-3403a4b8f6398f34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
git pull origin master
```
或
```
git push --set-upstream origin master
```
建议第二种，会在本地创建分支。
##### 配置ssh连接到GitHub
1. 首先,桌面上右键打开`Git Bash Here `输入：
```
cd ~/.ssh
```
如果返回没有找到文件或目录，则说明没有生成ssh key，则需要重新生成！
![未建立连接.png](https://upload-images.jianshu.io/upload_images/17728182-9d5cad2566fa6729.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
反之，如果成功进入到该目录，说明已生成过ssh key，可直接使用。
2. 新建 ssh key，输入：
```
 ssh-keygen -t rsa -C "你的邮箱名@你邮箱地址.com"
```
![新建密匙.png](https://upload-images.jianshu.io/upload_images/17728182-2b3a7b74d7b65f8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
红线部分是新建地址，可以找到该目录。紫线部分是此前输入的邮箱地址。
3. 查看密匙，输入
```
cat ~/.ssh/id_rsa.pub
```
返回生成密匙；也可以根据上一步骤（红线）的地址提示，找到该目录下名为`id_rsa.pub`的文件，用记事本打开，即可获取密匙。
4. GitHub设置ssh
进入GitHbub,打开设置页面，找到**SSH and GPG keys**选项，点击**New SSH key**按钮后，在**key**粘贴上 ssh key 密匙，并保存。
5. 最后一步，回到git bash输入：
```
ssh -T git@github.com
```
完成验证，这一步会提示确认，只要输入`yes/no`后回车。如果让输入密码，则输入配置git时的密码，回车，得到成功提示，即完成配置。
![成功.png](https://upload-images.jianshu.io/upload_images/17728182-c859512393c11569.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)