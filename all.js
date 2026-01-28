
    const localhost = 'https://localhost:44389';
    const live = 'https://resturantapp-2z56.onrender.com'
    const currentDomain = live;
    const commonController = '/api/Home/';
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 70;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.boxShadow = '0 0 30px var(--accent-green-glow), 0 4px 12px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 0 20px var(--accent-green-glow)';
        }
    });

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Skill cards stagger animation
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        skillObserver.observe(card);
    });

    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.7s ease-out';
        timelineObserver.observe(item);
    });

    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        projectObserver.observe(card);
    });

    // Contact cards animation
    const contactCards = document.querySelectorAll('.contact-card');
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, index * 100);
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    contactCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.5s ease-out';
        contactObserver.observe(card);
    });

    // Smooth page load
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    console.log('%c💻 Developer Portfolio Loaded Successfully!', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with Quicksand & Fira Sans by Yaser Shaikh', 'color: #00ff88; font-size: 12px;');

            function getDeviceType() {
        const ua = navigator.userAgent;

        if (/mobile/i.test(ua)) return "Mobile";
        if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
        return "Laptop / Desktop";
    }
    
function getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getCityFromTimezone(tz) {
    if (!tz) return "Unknown";
    const parts = tz.split('/');
    return parts[1] ? parts[1].replace(/_/g, ' ') : "Unknown";
}

// Small internal map ONLY for country codes (covers all major TZ cities)
const tzToCountryCode = {
    // India / Nepal / Sri Lanka
    "Asia/Kolkata": "IN",
    "Asia/Calcutta": "IN",
    "Asia/Kathmandu": "NP",
    "Asia/Colombo": "LK",

    // Middle East
    "Asia/Dubai": "AE",
    "Asia/Riyadh": "SA",
    "Asia/Qatar": "QA",
    "Asia/Bahrain": "BH",
    "Asia/Kuwait": "KW",
    "Asia/Muscat": "OM",
    "Asia/Jerusalem": "IL",

    // Asia
    "Asia/Tokyo": "JP",
    "Asia/Singapore": "SG",
    "Asia/Bangkok": "TH",
    "Asia/Jakarta": "ID",
    "Asia/Manila": "PH",
    "Asia/Seoul": "KR",
    "Asia/Shanghai": "CN",
    "Asia/Hong_Kong": "HK",
    "Asia/Kuala_Lumpur": "MY",
    "Asia/Taipei": "TW",

    // Europe
    "Europe/London": "GB",
    "Europe/Paris": "FR",
    "Europe/Berlin": "DE",
    "Europe/Rome": "IT",
    "Europe/Madrid": "ES",
    "Europe/Amsterdam": "NL",
    "Europe/Moscow": "RU",
    "Europe/Istanbul": "TR",

    // America
    "America/New_York": "US",
    "America/Los_Angeles": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "America/Mexico_City": "MX",
    "America/Sao_Paulo": "BR",
    "America/Argentina/Buenos_Aires": "AR",

    // Africa
    "Africa/Cairo": "EG",
    "Africa/Nairobi": "KE",
    "Africa/Johannesburg": "ZA",

    // Australia / NZ
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Pacific/Auckland": "NZ"
};

function getCountryFromTimezone() {
    const tz = getTimezone();
    const code = tzToCountryCode[tz];

    if (!code) return "Unknown";

    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code);
}

const tz = getTimezone();

const userInfo = {
    country: getCountryFromTimezone(),
    city: getCityFromTimezone(tz),
    state: "Not available (JS cannot detect)",
    province: "Not available (JS cannot detect)",
    deviceType: getDeviceType(),
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer,
    currentUrl: window.location.href
};

// const userInfo = {
//     country: getCountryFromTimezone(),            // Much more accurate
// state: "Not available (JS cannot detect)",
// province: "Not available (JS cannot detect)",
// //  localDateTime: new Date().toLocaleString(),
// deviceType: getDeviceType(),
// platform: navigator.platform,
// //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// userAgent: navigator.userAgent,
// language: navigator.language,
// referrer: document.referrer,
// currentUrl: window.location.href,
// //   timeVisitedUTC: new Date().toISOString(),
// // VisitDate: new Date().toISOString()
//};

// $.ajax({
// url: currentDomain + '/api/Home/AddViewerDetails',
// type: 'POST',
// contentType: 'application/json',
// data: JSON.stringify(userInfo),  // ✔ send pure object
// success: function (response) {
//     //  console.log("Success:", response);
//     console.log("Success From api");
//     },
// error: function (xhr, status, error) {
//     console.error("Error:", xhr.responseText);
// }
// });

/*$(document).ready(function () {
$.ajax({
    url: 'https://resturantapp-2z56.onrender.com/api/Home/accountprofilepicture',
    type: 'GET',
    success: function (data) {
        $('#profileimg').attr('src', data); // ✅ correct
        console.log(data);
    },
    error: function (err) {
        console.error(err);
    }
});
});*/
function checkImageExists(url) {
return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
});
}


$(document).ready(function () {
loadProfileImage();
});

async function loadProfileImage() {
try {
    const url = await $.ajax({
        url: currentDomain + commonController + 'accountprofilepicture',
        type: 'GET'
    });

    const isValid = await checkImageExists(url);

    if (isValid) {
        $('#profileimg').attr('src', url);
        console.log("Image loaded");
    } else {
        console.log("Expired URL, requesting new one...");

        // call API again to regenerate presigned URL
        const newUrl = await $.ajax({
            url: 'myimg.jpg',
            type: 'GET'
        });

        $('#profileimg').attr('src', newUrl);
    }

} catch (err) {
    console.error(err);
}
}


$.ajax({
url: currentDomain + commonController + 'GetWhyHireMe',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtwhyhireme").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetChallengesSolved',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtchallenges").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetCodeQualityPrinciples',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtcodequality").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetApiintegrations',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtapiintegrations").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetSecurityPractices',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtsecuritypractices").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});

$.ajax({
url: currentDomain + commonController + 'GetHowIWork',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txthowiwork").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetTechStackDaily',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txttechstackiusedaily").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain + commonController + 'GetKeyAchivement',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtkeyachievements").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});

$.ajax({
url: currentDomain + commonController + 'GetWhatCanIDoForYou',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("txtwhatcanidoforyou").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});


$.ajax({
url: currentDomain +  commonController + 'GetDetails',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    //document.getElementById("rp").style.display='block';
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});





$.ajax({
    url: currentDomain + commonController + 'GetExperience',
    type: 'GET',
    contentType: 'application/json',
    success: function (response) {
        console.log("Success From api - Experience", response);
        renderExperienceTimeline(response);
    },
    error: function (xhr, status, error) {
        console.error("Error:", xhr.responseText);
    }
});

function renderExperienceTimeline(experiences) {
    // Parent container
    const $timeline = $('#experienceTimeline');
    $timeline.empty(); // clear previous content

    if (experiences.length === 0) {
        $timeline.html('<p>No experience found.</p>');
        return;
    }

    // Sort experiences by fromDate (optional)
   // experiences.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));

    // Loop through each experience and create child items
    experiences.forEach(exp => {
        const from = new Date(exp.fromDate).toLocaleString('default', { month: 'short', year: 'numeric' });
        const to = exp.toDate ? new Date(exp.toDate).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Present';

        const timelineItem = `
            <div class="timeline-item fade-in">
                <div class="timeline-date">${from} – ${to}</div>
                <div class="timeline-content">
                    <h3>${exp.designation}</h3>
                    <div class="timeline-company">${exp.locationOrganization}</div>
                    <p class="timeline-description">
                        ${exp.description}
                    </p>
                </div>
            </div>
        `;

        $timeline.append(timelineItem);
    });
}



$.ajax({
url: currentDomain + commonController + 'GetTools',
type: 'GET',
contentType: 'application/json',
success: function (response) {

    const container = document.getElementById("toolsContainer");
    container.innerHTML = ""; // clear previous

    response.forEach(tool => {

        const span = document.createElement("span");
        span.className = "tech-tag";

        span.innerHTML = `
            <i class="tech-icon ${tool.toolIcon}"></i> ${tool.toolName}
        `;

        container.appendChild(span);
    });
},
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});



$.ajax({
    url: currentDomain + commonController + 'GetTechnology', // or your correct API URL
    type: 'GET',
    contentType: 'application/json',
    success: function(response) {
        console.info(response);
        const container = document.getElementById("skillsGrid");
        container.innerHTML = ""; // Clear previous

        response.forEach(t => {
          //  alert(t);
            const card = document.createElement("div");
            card.className = "skill-card fade-in";

            card.innerHTML = `
                <div class="skill-icon"><i class="${t.icon}"></i></div>
                <h3>${t.title}</h3>
                <p>${t.description}</p>
            `;

            container.appendChild(card);
        });
    },
    error: function(xhr, status, error) {
        console.error("Error fetching technologies:", xhr.responseText);
    }
});




$.ajax({
url: currentDomain + commonController + 'GetAboutus',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    console.log("Success From api");
    document.getElementById("aboutusDescription").innerHTML = response;
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr.responseText);
}
});

let redirectTimer = setTimeout(() => {
Swal.fire({
    icon: 'warning',
    title: 'Taking longer than expected…',
    text: 'Redirecting you shortly',
    showConfirmButton: false,
    timer: 4000
});

setTimeout(() => {
    window.location.href = 'index2.html';
}, 4000);

}, 20000); // 10 sec safety redirect


// Show loader
Swal.fire({
title: 'Loading Profile…',
html: 'Fetching the latest details',
allowOutsideClick: false,
allowEscapeKey: false,
didOpen: () => Swal.showLoading()
});


// API call
$.ajax({
url: currentDomain + commonController + 'GetDescription/',
type: 'GET',

success: function (response) {
    clearTimeout(redirectTimer);

    document.getElementById("industries").textContent = response.industries;
    document.getElementById("description").textContent = response.summary;
    document.getElementById("yoe").textContent = response.yearsofExperience;
    document.getElementById("projectsdelievered").textContent = response.projectsDelivered;
    document.getElementById("designation").textContent = response.designation;
    document.getElementById("designation2").textContent = response.designation;

    // 🕒 Delay before closing loader
    setTimeout(() => {
        Swal.close();
    }, 900); // 👈 smooth UX delay
},

error: function () {
    clearTimeout(redirectTimer);

    Swal.fire({
        icon: 'error',
        title: 'Unable to load profile',
        text: 'Please try again later'
    });
}
});



$.ajax({
url: currentDomain + commonController + 'GetTheme/',
type: 'GET',
contentType: 'application/json',
success: function (response) {
    console.log("Success:", response);
    document.documentElement.style.setProperty('--accent-green', response);
    document.documentElement.style.setProperty('--accent-green-dark', response);
    document.documentElement.style.setProperty('--accent-green-light', response);
    document.documentElement.style.setProperty('--accent-green-glow', response);
    document.documentElement.style.setProperty('--accent-green-dark-glow', response);

    Swal.fire({
        icon: 'success',
        title: 'Profile Loaded',
        showConfirmButton: false,
        timer: 1200
    });


    //console.log("Success From api");
    //document.getElementById("rp").style.display='block';
    },
error: function (xhr, status, error) {
    console.error("Error:", xhr);
}
});

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


$(function () {
    // Fetch projects from API
    $.ajax({
        url: currentDomain +  commonController + 'GetProjects',
        type: 'GET',
        contentType: 'application/json',
        success: function (projects) {
            let html = '';

            // Emoji mapping (you can expand or randomize)
        
            projects.forEach((project, index) => {
                // Render tools
                let toolsHtml = '';
                if (project.tools && project.tools.length > 0) {
                    project.tools.forEach(tool => {
                        toolsHtml += `<span class="project-tag">${tool.toolName}</span>`;
                    });
                }

                // Append project card
                html += `
                    <div class="project-card fade-in">
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tags">
                                ${toolsHtml}
                            </div>
                        </div>
                    </div>
                `;
            });

            // Inject into container
            $('#toolsContainer2').html(html);

            // Optional: fade-in effect
            $('.project-card').hide().fadeIn(800);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching projects:", xhr.responseText);
            $('#toolsContainer2').html('<p>No projects found.</p>');
        }
    });
});

function Validate() {

    var name = $('#name');
    var email = $('#email');
    var message = $('#message');
    if(name.val()==""){
        Swal.fire("Please Enter the Name");
        return false;
    }
    if(email.val()==""){
        Swal.fire("Please Enter the Email");
        return false;
    }
    if(message.val()==""){
        Swal.fire("Please Enter the Message");
        return false;
    }

    var contact = {
        name: $('#name').val(),
        email: $('#email').val(),
        message: $('#message').val()
    };

    //console.log(contact);

    $.ajax({
        url: currentDomain + commonController + 'Contact',   // ✅ correct MVC route
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(contact),  // ✔ send pure object
        success: function (response) {
            console.log("Success:", response);
            Swal.fire("Thank You",
                "Thank you for reaching out. I will get back to you soon.",
                "success");
        },
        error: function (xhr,err) {
            console.error("Error:", xhr);
        }
    });

    //return false; // important
}


