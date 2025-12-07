// ⭐ script.js — 난이도 표시 + 마우스 드래그 가로 스크롤 전용 ⭐
// 1) 난이도 점 채우기
// 2) 마우스로 카드 영역을 잡고 드래그해서 가로 스크롤

// 1. 난이도 점 채우기
function initializeDifficulty() {
    const diffContainers = document.querySelectorAll('.difficulty');
    console.log('🔥 난이도 컨테이너 개수:', diffContainers.length);

    diffContainers.forEach(diffContainer => {
        const difficulty = parseInt(diffContainer.getAttribute('data-difficulty'), 10);
        const dots = diffContainer.querySelectorAll('.dot');

        dots.forEach((dot, index) => {
            if (index < difficulty) {
                dot.classList.add('fill');      // 채워진 점
            } else {
                dot.classList.remove('fill');   // 혹시 남아 있던 fill 제거
            }
        });
    });
}

// 2. 마우스 드래그로 가로 스크롤 하기
function setupSliderDrag() {
    const container = document.getElementById('scrollContainer');
    if (!container) {
        console.log('⚠ scrollContainer 없음 — 이 페이지는 슬라이더 없음');
        return;
    }

    let isDown = false;
    let startX;
    let scrollLeft;

    // 마우스를 누를 때: 드래그 시작
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('is-dragging');   // 커서 모양 바꾸기용
        startX = e.pageX - container.offsetLeft;  // 클릭한 X 위치
        scrollLeft = container.scrollLeft;        // 시작 시점 스크롤 값
    });

    // 마우스를 떼거나 영역을 벗어나면: 드래그 종료
    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('is-dragging');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('is-dragging');
    });

    // 마우스를 움직일 때: 드래그 중이면 가로로 스크롤 이동
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;          // 드래그 상태가 아니면 무시
        e.preventDefault();           // 텍스트 선택 방지
        const x = e.pageX - container.offsetLeft;
        const walk = (startX - x);    // 얼마나 움직였는지
        container.scrollLeft = scrollLeft + walk;
    });
}

// 3. DOM이 준비된 후 한 번만 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ script.js 초기화');

    initializeDifficulty();  // 난이도 점 채우기
    setupSliderDrag();       // 드래그 스크롤 세팅
});

window.onload = function() {
    const projectId = getProjectIdFromUrl(); 
    const data = detailProjectData[projectId];

    if (data) {
        // 텍스트 정보 삽입
        document.getElementById('detail-title').textContent = data.title;
        document.getElementById('detail-subtitle').textContent = data.subtitle;

        // ⭐ 이미지 vs PDF 엘리먼트 가져오기
        const imgEl     = document.getElementById('detail-main-image');
        const pdfEl     = document.getElementById('detail-main-pdf');
        const captionEl = document.getElementById('detail-main-caption');

        if (data.pdfUrl) {
            // 📄 PDF가 있는 프로젝트: PDF 임베드
            if (pdfEl) {
                pdfEl.style.display = 'block';
                pdfEl.src = data.pdfUrl;
            }
            if (imgEl) {
                imgEl.style.display = 'none';
                imgEl.removeAttribute('src');
            }
            if (captionEl) {
                captionEl.textContent = '기획안 PDF 미리보기';
            }
        } else {
            // 🖼 PDF가 없으면 기본 이미지 사용
            if (imgEl) {
                imgEl.style.display = 'block';
                imgEl.src = data.mainImageUrl;
            }
            if (pdfEl) {
                pdfEl.style.display = 'none';
                pdfEl.removeAttribute('src');
            }
            if (captionEl) {
                captionEl.textContent = '작업물 사진';
            }
        }

        // 나머지 기존 코드 그대로 유지
        document.getElementById('detail-intention-text').textContent = data.intention;
        
        // 기여도 차트 및 퍼센트
        document.getElementById('detail-contribution-percent').textContent = data.contributionPercent + '%';
        renderDetailChart(data.contributionData, data.contributionPercent);
        
        // 툴 아이콘 삽입
        const toolsContainer = document.getElementById('detail-tools-icons');
        toolsContainer.innerHTML = '';
        data.tools.forEach(tool => {
            toolsContainer.innerHTML += `
                <div class="tool-icon">
                    <img src="${tool.icon}" alt="${tool.name}">
                    <span>${tool.name}</span>
                </div>
            `;
        });

    } else {
        document.getElementById('detail-title').textContent = "프로젝트를 찾을 수 없습니다.";
        document.getElementById('detail-subtitle').textContent = "유효하지 않은 프로젝트 ID입니다.";
    }
};
