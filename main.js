const CATALOGUE_VIDEOS = {
  'cote-qui-range': {
    titre: 'DonkeyNote · « La cote qui range »',
    poster: 'images/projets/2026/donkeynote-interface.png',
    sources: {
      '16x9': 'videos/16x9/05-donkeynote-cote-qui-range-16x9.mp4',
      '9x16': 'videos/9x16/05-donkeynote-cote-qui-range-9x16.mp4'
    }
  },
  'test-de-la-vue': {
    titre: 'Propulsion Numérique · Boussole « Le test de la vue »',
    poster: 'images/projets/2026/boussole-test-vue.png',
    sources: {
      '16x9': 'videos/16x9/04-boussole-test-de-la-vue-16x9.mp4',
      '9x16': 'videos/9x16/04-boussole-test-de-la-vue-9x16.mp4'
    }
  },
  'des-formulaires': {
    titre: 'Propulsion Numérique · « Des formulaires pour tout »',
    poster: 'images/projets/2026/motion-design-3a.png',
    sources: {
      '16x9': 'videos/16x9/03-des-formulaires-pour-tout-16x9.mp4',
      '9x16': 'videos/9x16/03-des-formulaires-pour-tout-9x16.mp4'
    }
  },
  'formulaire-rdv': {
    titre: 'Certi-Pro · « Formulaire de prise de RDV »',
    poster: 'images/projets/2026/certi-pro-accueil.webp',
    sources: {
      '16x9': 'videos/16x9/01-formulaire-rdv-16x9.mp4',
      '9x16': 'videos/9x16/01-formulaire-rdv-9x16.mp4'
    }
  },
  'rappel-entretien': {
    titre: 'Certi-Pro · « Rappel d\'entretien (étape 2 du formulaire RDV) »',
    poster: 'images/projets/2026/certi-pro-calendrier-ia.png',
    sources: {
      '16x9': 'videos/16x9/02-rappel-entretien-16x9.mp4',
      '9x16': 'videos/9x16/02-rappel-entretien-9x16.mp4'
    }
  }
};

function detecterFormatEcran() {
  const estMobileOuPortrait =
    window.matchMedia('(max-width: 767px)').matches ||
    window.innerHeight > window.innerWidth;
  return estMobileOuPortrait ? '9x16' : '16x9';
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  const overlay = document.getElementById('overlay');
  const closeMenu = document.getElementById('closeMenu');
  const links = menu.querySelectorAll('a');

  function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenuFn() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenuFn() : openMenu();
  });

  closeMenu.addEventListener('click', closeMenuFn);
  overlay.addEventListener('click', closeMenuFn);

  const sectionsClaires = document.querySelectorAll('[data-clair]');

  const observerClair = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          menuToggle.classList.add('clair');
        } else {
          menuToggle.classList.remove('clair');
        }
      });
    },
    { threshold: 0.5 }
  );

  sectionsClaires.forEach(section => observerClair.observe(section));
  sectionsClaires.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top < window.innerHeight * 0.5 &&
      rect.bottom > window.innerHeight * 0.5
    ) {
      menuToggle.classList.add('clair');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', closeMenuFn);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.carte-projet').forEach(carte => {
    observer.observe(carte);
  });

  // Lecteur vidéo intelligent (16:9 ordinateur / 9:16 mobile)
  const modalVideo = document.getElementById('modal-video');
  const boiteVideo = modalVideo.querySelector('.modal-video-boite');
  const lecteurVideo = document.getElementById('lecteur-video');
  const titreVideo = document.getElementById('modal-video-titre');
  const badgeVideo = document.getElementById('modal-video-badge');
  const btn16x9 = document.getElementById('btn-format-16x9');
  const btn9x16 = document.getElementById('btn-format-9x16');
  const btnFermerVideo = document.getElementById('close-modal-video');

  let cleVideoActive = null;
  let formatVideoActif = null;

  function chargerVideo(cle, format, estAuto) {
    const entree = CATALOGUE_VIDEOS[cle];
    if (!entree) return;

    cleVideoActive = cle;
    formatVideoActif = format;

    titreVideo.textContent = entree.titre;
    const libelleFormat =
      format === '9x16' ? '9:16 (mobile / portrait)' : '16:9 (paysage)';
    badgeVideo.textContent = estAuto
      ? 'Format ' + libelleFormat + ' sélectionné automatiquement selon votre écran'
      : 'Format ' + libelleFormat;

    boiteVideo.classList.toggle('format-9x16', format === '9x16');
    btn16x9.classList.toggle('actif', format === '16x9');
    btn9x16.classList.toggle('actif', format === '9x16');

    lecteurVideo.pause();
    if (entree.poster) {
      lecteurVideo.setAttribute('poster', entree.poster);
    }
    lecteurVideo.src = entree.sources[format];
    lecteurVideo.load();
    modalVideo.classList.remove('hidden');

    lecteurVideo.onloadedmetadata = () => {
      if (lecteurVideo.paused && lecteurVideo.currentTime === 0) {
        lecteurVideo.currentTime = 0.6;
      }
    };

    const promesseLecture = lecteurVideo.play();
    if (promesseLecture && typeof promesseLecture.catch === 'function') {
      promesseLecture.catch(() => {});
    }
  }

  function fermerModalVideo() {
    lecteurVideo.pause();
    lecteurVideo.removeAttribute('src');
    lecteurVideo.load();
    modalVideo.classList.add('hidden');
    cleVideoActive = null;
  }

  document.querySelectorAll('[data-video]').forEach(lien => {
    lien.addEventListener('click', e => {
      const cle = lien.getAttribute('data-video');
      if (CATALOGUE_VIDEOS[cle]) {
        e.preventDefault();
        const formatAuto = detecterFormatEcran();
        chargerVideo(cle, formatAuto, true);
      }
    });
  });

  btn16x9.addEventListener('click', () => {
    if (cleVideoActive && formatVideoActif !== '16x9') {
      chargerVideo(cleVideoActive, '16x9', false);
    }
  });

  btn9x16.addEventListener('click', () => {
    if (cleVideoActive && formatVideoActif !== '9x16') {
      chargerVideo(cleVideoActive, '9x16', false);
    }
  });

  btnFermerVideo.addEventListener('click', fermerModalVideo);
  modalVideo.addEventListener('click', e => {
    if (e.target === modalVideo) {
      fermerModalVideo();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenuFn();
      if (!modalVideo.classList.contains('hidden')) {
        fermerModalVideo();
      }
      const modalImg = document.getElementById('modal-image');
      if (modalImg && !modalImg.classList.contains('hidden')) {
        modalImg.classList.add('hidden');
      }
    }
  });

  // Ouverture directe via ?video=... dans l'URL
  const params = new URLSearchParams(window.location.search);
  const videoParam = params.get('video');
  if (videoParam && CATALOGUE_VIDEOS[videoParam]) {
    const formatUrl = params.get('format');
    const formatRetenu =
      formatUrl === '16x9' || formatUrl === '9x16'
        ? formatUrl
        : detecterFormatEcran();
    chargerVideo(videoParam, formatRetenu, !formatUrl);
  }
});

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const isOpen = content.classList.contains('open');

    document.querySelectorAll('.accordion-content.open').forEach(openContent => {
      openContent.classList.remove('open');
      openContent.previousElementSibling
        .querySelector('.chevron')
        .classList.remove('rotated');
    });

    if (!isOpen) {
      content.classList.add('open');
      header.querySelector('.chevron').classList.add('rotated');
    }
  });
});

document.querySelectorAll('.image-projet-pleine').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.getElementById('modal-image');
    const imgFull = document.getElementById('image-grand-format');
    imgFull.src = img.src;
    imgFull.alt = img.alt;
    modal.classList.remove('hidden');
  });
});

document.getElementById('modal-image').addEventListener('click', e => {
  if (
    e.target.id === 'modal-image' ||
    e.target.classList.contains('close-modal')
  ) {
    e.currentTarget.classList.add('hidden');
  }
});
