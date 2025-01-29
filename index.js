// npm 
// it is a package manager for javascript 

// const chalk = require("chalk")

// console.log(chalk);

// const fs = require("fs")
// function main(fileName){
//     console.log(process.argv);
    
//     fs.readFile(fileName,"utf-8", function(err, data){
//         // count the number of words- "n" in this data 

//         let total = 0 
//         for(let i = 0; i < data.length; i++){
//             // if (data[i] === "n") {
//             //     total ++
//             // }
//             if (data[i] === " ") {
//                 total ++
//             }
//         }
//         console.log(total + 1);
        
//     })

// }


// // a.txt ==> ramesh and naman

// main("a.txt") // 3 ( ramesh 1, and 2, naman3 )


/*
with the help of process.argv, we can see which all arguments we passed with node cli


$ node index.js/ Users/NAMAN/ Desktop/harkirat-class-node
[
  'C:\\Users\\NAMAN\\AppData\\Roaming\\nvm\\v21.6.2\\node.exe',
  'C:\\Users\\NAMAN\\Desktop\\harkirat-class-node\\index.js',
  'Users/NAMAN/',
  'Desktop/harkirat-class-node'
]
3 --> output of the function main()


explanation : 

1 argv --> C:\\Users\\NAMAN\\AppData\\Roaming\\nvm\\v21.6.2\\node.exe ----> node address 
2nd argv ----> C:\\Users\\NAMAN\\Desktop\\harkirat-class-node\\index.js ----> index.js address 
3rd argv -----> Users/NAMAN --------> desktop of naman's address 
4th argv ------> Desktop/harkirat-class-node  ------------------> address of harkirat-class-node folder 
*/


/*

PS C:\Users\NAMAN\Desktop\harkirat-class-node> node index.js naman is funny  

o/p at terminal is :-->

[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\NAMAN\\Desktop\\harkirat-class-node\\index.js',
  'naman',
  'is',
  'funny'
]
3

*/




// const fs = require("fs")
// function main(fileName){
//     // console.log(process.argv);
    
//     fs.readFile(fileName,"utf-8", function(err, data){
//         // count the number of words- "n" in this data 

//         let total = 0 
//         for(let i = 0; i < data.length; i++){
//             // if (data[i] === "n") {
//             //     total ++
//             // }
//             if (data[i] === " ") {
//                 total ++
//             }
//         }
//         console.log(total + 1);
        
//     })

// }


// a.txt ==> ramesh and naman

// main("a.txt") // 3 ( ramesh 1, and 2, naman3 )


// main(process.argv[2])

// now if we send in command line 

// node index.js a.txt  and enter 
// o/p -> 3 

 
// that means we are sending the text file from where we want the function main to calculate the number of words 
// we are sending that fileAddress alongside the node index.js  


// process.argv[2] means access the address of 2nd argument sent in node cli 

// node index.js a.txt  ----> process.argv[1] == Index.js and process.argv[2] == a.txt



// right now, our CLI doesnt have the helper func functionality 

// we can use commander- an external library to do that 



/// ********* using commander library *********** /// 

const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .name('counter')
  .description('CLI to do file based tasks')
  .version('0.8.0');

program.command('count_words') /// this is the command we need to use before the filepath in our CLI 
  .description('Count the number of words in a file')
  .argument('<file>', 'file to count')
  .action((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const words = data.split(' ').length;
        console.log(`There are ${words} words in ${file}`);
      }
    });
  });

// adding command 2 into our CLI 

program.command('count_vowels') /// this is the command we need to use before the filepath in our CLI 
  .description('Count the number of vowels in a file')
  .argument('<file>', 'file to count')
  .action((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const vowels = data.split('aeiou').length;
        console.log(`There are ${vowels} vowels in ${file}`);
      }
    });
  });

program.parse();

/*

terminal i/p : node index.js count_words a.txt

o/p : There are 3 words in a.txt

*/


/*

note: we can also different commands in our CLI. 

... we added count_vowels as 2nd command to our CLI, it acts as one of the helper func of our CLI 



terminal i.p : node index.js count_vowels a.txt 
o/p : Ther are 1 vowels in a.txt

*/



/*


This commander also adds a -h functionality to our CLI

so, now if we run node index.js -h in terminal 
o/p : 

CLI to do file based tasks

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  count_words <file>   Count the number of words in a file
  count_vowels <file>  Count the number of vowels in a file
  help [command]       display help for command



YES, now all the functionalities of a common CLI is also available with our self made CLI 

*/