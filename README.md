<p>To run this project, you need: </p>
<p>*Run <strong>yarn install</strong> or <strong>npm install</strong> to install all required node modules</p>

<p>*Create <strong>auth.js</strong> file in <strong>src/services/</strong> then config the file with the following block of code: </p>
<hr>
<p>const timeStamp = new Date().getTime()</p>
<p>import md5 from 'md5'</p>
<p>const apikey = 'your_public_key'</p>
<p>const privateKey = 'your_private_key'</p>
<p>export default {</p>
<p>    ts: timeStamp,</p>
<p>    apikey,</p>
<p>    hash: md5(`${timeStamp}${privateKey}${apikey}`)</p>
<p>}</p>
<hr>
<strong>You can get these keys at https://developer.marvel.com/ </strong>

<p>If you want to run in iOS, first:</p>
<p>Run <strong>pod install</strong> in <strong>ios/</strong></p>
