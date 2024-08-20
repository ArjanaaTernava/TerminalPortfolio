const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const directories = {
    education: [
        '<white>education</white>',
        '* <a href="https://fiek.uni-pr.edu">University of Pristina, Faculty of Electrical and Computer Engineering</a> <yellow>"Computer Engineering"</yellow> 2020-2024',
    ],
    skills: [
        '<white>Programming Languages</white>',
        [
            'Java',
            'JavaScript',
            'TypeScript',
            'MySQL',
            'PostgreSQL',
            'PHP',
            'Bash'
        ].map(lang => `* <yellow>${lang}</yellow>`).join('\n'),
        '',
        '<white>Libraries</white>',
        [
            'React.js',
            'JUnit'
        ].map(lib => `* <green>${lib}</green>`).join('\n'),
        '',
        '<white>Frameworks</white>',
        [
            'Spring Boot',
        ].map(lib => `* <green>${lib}</green>`).join('\n'),
        '',
        '<white>Tools & Platforms</white>',
        [
            'Docker',
            'AWS',
            'Git',
            'Linux',
            'Jenkins',
            'Terraform'
        ].map(tool => `* <blue>${tool}</blue>`).join('\n'),
    ].flat(),
    experience: [
        '<white>Professional Experience</white>',
        '* <a href="https://www.evonem.com">EVONEM, Pristina</a> <yellow>"Software Engineer"</yellow> April 2023 - Present',
        '  - Architected and implemented scalable RESTful web services using <green>Spring Boot</green> and <blue>PostgreSQL</blue>.',
        '  - Developed secure authentication mechanisms using <yellow>JWT</yellow> and extended <green>Spring Security</green> functionalities.',
        '  - Implemented automated database schema migrations using <blue>Flyway</blue>.',
        '  - Designed responsive UIs with <green>React.js</green>, optimizing performance with advanced techniques.',
        '  - Integrated comprehensive test suites with <green>JUnit Jupiter</green> and <blue>Testcontainers</blue>.',
    ],
    certifications: [
        '<white>Certifications</white>',
        '* <a href="#">AWS Certified Cloud Practitioner</a> <yellow>August 2023</yellow>',
        '* <a href="#">Cyber Security Training, Cisco Networking Academy</a> <yellow>October 2021</yellow>',
        '* <a href="#">Global Engineering Girls Project</a> <yellow>October 2023</yellow>',
        '* <a href="#">Techstitution Programme, Peer Education Network</a> <yellow>November 2022</yellow>',
    ],
    personalSkills: [
        '<white>Personal Skills</white>',
        '* <yellow>Adaptability</yellow>',
        '* <yellow>Time Management</yellow>',
        '* <yellow>Teamwork</yellow>',
        '* <yellow>Problem Solving</yellow>',
        '* <yellow>Leadership</yellow>',
        '* <yellow>Attention to Detail</yellow>',
        '* <yellow>Motivation</yellow>',
        '* <yellow>Critical Thinking</yellow>',
        '* <yellow>Work Ethic</yellow>',
        '* <yellow>Communication</yellow>',
        '* <yellow>Continuous Learning</yellow>',
    ],
    languages: [
        '<white>Languages</white>',
        '* <yellow>Albanian</yellow> – Native proficiency',
        '* <yellow>English</yellow> – Full professional proficiency',
    ],
    projects: [
        '<white>Projects</white>',
        '* <a href="https://github.com/ArjanaaTernava/eCommerce">eCommerce</a> <yellow>"This eCommerce project leverages the power of the MERN stack, combined with Redux for efficient state management."</yellow>',
        '* <a href="https://github.com/erzaosmani/Notes_App_IOS_Project_2023">Notes App</a> <yellow>"This repository contains the source code for a lightweight note-taking application built using Swift and Xcode."</yellow>',
    ]
};


const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'arjana';
const server = 'portfolio';

function prompt() {
    return `<red>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                 print_dirs();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    async joke() {
        const res = await fetch('https://v2.jokeapi.dev/joke/Programming');
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                const prompt = this.get_prompt();
                this.set_prompt('');
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50,
                    typing: true
                });
            }
        })();
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    }
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white class="command">${command}</white><aquamarine>${args}</aquamarine>`;
}]);

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt
});

term.pause();

term.on('click', '.command', function() {
   const command = $(this).text();
   term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});

function ready() {
   const seed = rand(256);
   term.echo(() => rainbow(render('Terminal Portfolio'), seed))
       .echo('<white>Welcome to my Terminal Portfolio</white>\n').resume();
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}
