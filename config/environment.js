const development = {
	name:'development',
	port:3000,
	session_cookie_key:process.env.LIBRARY_SESSION_COOKIE_KEY,
	db:'Library_KNIT',
	gmail_id:process.env.GMAIL_ID,
	gmail_password:process.env.GMAIL_PASSWORD,
	google_client_id:process.env.LIBRARY_GOOGLE_CLIENT_ID,
	google_client_secret:process.env.LIBRARY_GOOGLE_CLIENT_SECRET,
	google_callback_url:process.env.LIBRARY_GOOGLE_CALLBACK_URL,
	ADMIN_EMAIL:process.env.ADMIN_EMAIL
}


module.exports = eval(process.env.NODE_ENV == undefined ? development:eval(process.env.NODE_ENV));
