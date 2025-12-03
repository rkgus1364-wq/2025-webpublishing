// ⭐️ 이 코드를 script.js 파일에 복사하세요. ⭐️

// 프로젝트별 상세 데이터를 저장하는 객체
const projectData = {
    "project1": {
        title: "웹 디자인 기초",
        subtitle: "사용자 경험 중심의 반응형 웹사이트 구축",
        mainImageUrl: "https://placehold.co/700x500/E5DDD7/EF543E?text=MAIN+VISUAL+1",
        difficulty: 1,
        contributionPercent: 100,
        intention: "디자인 원칙과 웹 퍼블리싱 기술의 기초를 다지기 위한 실습 프로젝트. 웹 표준 및 접근성을 고려했습니다.",
        tools: [
            { name: "HTML5", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=H" },
            { name: "CSS3", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=C" },
            { name: "Figma", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=F" },
        ],
        contributionData: [
            { label: "디자인", value: 60, color: '#EF543E' },
            { label: "퍼블리싱", value: 40, color: '#2E364F' }
        ]
    },
    "project2": {
        title: "브랜드 전시 기획",
        subtitle: "서울장수 브랜드 팝업형 전시 기획 전담",
        mainImageUrl: "https://placehold.co/700x500/E5DDD7/EF543E?text=MAIN+VISUAL+2",
        difficulty: 3,
        contributionPercent: 80,
        intention: "브랜드 전시를 기획을 맡아 해당 전시를 총 2일간 전시를 진행. ",
        tools: [
            { name: "Figma", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=F" },
            { name: "Miro", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=M" },
            { name: "PPT", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=P" },
        ],
        contributionData: [
            { label: "기획", value: 80, color: '#EF543E' },
            { label: "디자인", value: 20, color: '#2E364F' }
        ]
    },
    "project3": {
        title: "브랜딩 디자인",
        subtitle: "가상의 카페 브랜드 'Lumine' BI 구축 프로젝트",
        mainImageUrl: "https://placehold.co/700x500/E5DDD7/EF543E?text=MAIN+VISUAL+3",
        difficulty: 3,
        contributionPercent: 95,
        intention: "일관성 있는 브랜드 아이덴티티를 구축하는 브랜딩 프로세스를 이해하고, 로고, 컬러, 타이포그래피를 정의했습니다.",
        tools: [
            { name: "Illustrator", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=Ai" },
            { name: "Photoshop", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=Ps" },
        ],
        contributionData: [
            { label: "브랜딩", value: 95, color: '#EF543E' },
            { label: "자료조사", value: 5, color: '#2E364F' }
        ]
    },
    "project4": {
        title: "데이터 시각화",
        subtitle: "D3.js를 활용한 인터랙티브 대시보드 제작",
        mainImageUrl: "https://placehold.co/700x500/E5DDD7/EF543E?text=MAIN+VISUAL+4",
        difficulty: 2,
        contributionPercent: 75,
        intention: "복잡한 데이터를 사용자가 쉽게 이해할 수 있도록 시각화 기법을 적용하고, D3.js로 동적인 차트를 구현했습니다.",
        tools: [
            { name: "D3.js", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=D3" },
            { name: "Tableau", icon: "https://placehold.co/40x40/2E364F/E5DDD7?text=T" },
        ],
        contributionData: [
            { label: "시각화", value: 75, color: '#EF543E' },
            { label: "데이터", value: 25, color: '#2E364F' }
        ]
    }
};

let currentChart = null; // Chart.js 인스턴스 저장용

// -----------------------------------------------------------
// 1. 카드 난이도 초기화 함수
// -----------------------------------------------------------
function initializeDifficulty() {
    document.querySelectorAll('.dots').forEach(diffContainer => {
        const difficulty = parseInt(diffContainer.getAttribute('data-difficulty'));
        const dots = diffContainer.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            if (index < difficulty) {
                dot.classList.add('fill');
            }
        });
    });
}

// -----------------------------------------------------------
// 2. 슬라이더 기능 설정 함수
// -----------------------------------------------------------
function setupSliderFunctionality() {
    const container = document.getElementById('scrollContainer');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const gap = 40; // CSS에서 설정한 gap 값

    // 다음 버튼 클릭 시
    nextBtn.onclick = () => {
        const cardWidth = container.querySelector('.card').offsetWidth;
        container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    };

    // 이전 버튼 클릭 시
    prevBtn.onclick = () => {
        const cardWidth = container.querySelector('.card').offsetWidth;
        container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    };

    // PC에서 마우스 휠로 가로 스크롤
    container.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        container.scrollLeft += evt.deltaY;
    });
}


// -----------------------------------------------------------
// 3. 모달 관련 함수 (상세 설명 표시)
// -----------------------------------------------------------
const overlay = document.getElementById('project-detail-overlay');
const closeBtn = document.getElementById('closeDetail');
const chartCanvas = document.getElementById('contributionChart');

function renderChart(contributionData, percent) {
    if (currentChart) {
        currentChart.destroy();
    }
    
    // 기여도 데이터에서 퍼센트와 나머지 값을 추출
    const data = [percent, 100 - percent];
    const colors = [contributionData[0].color, '#eee']; // 첫 번째 기여도 색상과 배경색 사용

    currentChart = new Chart(chartCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: contributionData.map(d => d.label),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            events: [],
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}

// 4. 상세 정보 로드 및 오버레이 표시 함수
function openDetail(id) {
    const data = projectData[id];
    if (!data) return; 

    // 텍스트 정보 삽입
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-subtitle').textContent = data.subtitle;
    document.getElementById('modal-intention-text').textContent = data.intention;
    document.getElementById('modal-main-image').src = data.mainImageUrl;
    
    // 기여도 차트 및 퍼센트
    document.getElementById('modal-contribution-percent').textContent = data.contributionPercent + '%';
    renderChart(data.contributionData, data.contributionPercent);
    
    // 툴 아이콘 삽입
    const toolsContainer = document.getElementById('modal-tools-icons');
    toolsContainer.innerHTML = '';
    data.tools.forEach(tool => {
        toolsContainer.innerHTML += `
            <div class="tool-icon">
                <img src="${tool.icon}" alt="${tool.name}">
                <span>${tool.name}</span>
            </div>
        `;
    });

    // 난이도 큰 점 삽입
    const difficultyContainer = document.getElementById('modal-difficulty-dots');
    difficultyContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const dotClass = i < data.difficulty ? 'fill' : '';
        difficultyContainer.innerHTML += `<div class="dot ${dotClass}"></div>`;
    }

    // 모달 표시 및 배경 스크롤 잠금
    overlay.style.display = 'flex'; 
    document.body.classList.add('modal-open');
}

// 5. 닫기 버튼 및 배경 클릭 이벤트 리스너
closeBtn.addEventListener('click', function() {
    overlay.style.display = 'none'; 
    document.body.classList.remove('modal-open');
});

overlay.addEventListener('click', function(e) {
    if (e.target === overlay) { 
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});

// 초기화 함수 실행
window.onload = function() {
    initializeDifficulty();
    setupSliderFunctionality();
};