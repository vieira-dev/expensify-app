// where? entry --> output bundle.js
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// CODIGO QUE ALTERA A VARIAVEL DE AMBIENTE PARA MUDAR O DATABASE USADO
if (process.env.NODE_ENV == 'test') {
	require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV == 'development') {
	require('dotenv').config({ path: '.env.development' });
}

module.exports = (env) => {
    const isProduction = env == 'production';
    const CSSExtract = new MiniCssExtractPlugin({ filename: 'styles.css' });
    
    return {
        entry: './src/app.js',
        // bundle output config
        output: {
            path: path.join(__dirname, 'public','dist'),
            filename: 'bundle.js'
        },
        module: {
            rules: [{ // regra para babel transpilar
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }, // regra para scss
            {
                test: /\.s?css$/,
                use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
        }]
        },
        // debuger config
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        // local server config
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true, // em caso de 404 serve o index 
            publicPath: '/dist/'
        },
        // css extract plugin config
        plugins: [
            CSSExtract,
            new webpack.DefinePlugin({ //passando os valores das enviroments
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID)
            })
        ]
    };
}




