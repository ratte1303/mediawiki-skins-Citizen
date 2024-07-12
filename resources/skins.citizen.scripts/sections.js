/**
 * Set up functionality of collapsable sections
 *
 * @param {HTMLElement} bodyContent
 * @return {void}
 */
function init( bodyContent ) {
	if ( !document.body.classList.contains( 'citizen-sections-enabled' ) ) {
		return;
	}

	const headings = bodyContent.querySelectorAll( '.citizen-section-heading' );
	const sections = bodyContent.querySelectorAll( '.citizen-section' );

	const setHeadlineAttributes = ( heading, collapsibleID, sectionIndex ) => {
		const headline = heading.querySelector( '.mw-headline, .mw-heading' );

		if ( !headline ) {
			return;
		}

		headline.setAttribute( 'tabindex', '0' );
		headline.setAttribute( 'role', 'button' );
		headline.setAttribute( 'aria-controls', collapsibleID );
		headline.setAttribute( 'aria-expanded', 'true' );
		headline.setAttribute( 'data-mw-citizen-section-heading-index', sectionIndex );
	};

	const setSectionAttributes = ( section ) => {
		section.setAttribute( 'aria-hidden', 'false' );
	};

	const toggleClasses = ( heading, section ) => {
		if ( section ) {
			heading.classList.toggle( 'citizen-section-heading--collapsed' );
			section.classList.toggle( 'citizen-section--collapsed' );
		}
	};

	const toggleAriaAttribute = ( el, attribute ) => {
		const isAttributeSet = el.getAttribute( attribute ) === 'true';
		el.setAttribute( attribute, isAttributeSet ? 'false' : 'true' );
	};

	const onEditSectionClick = ( e ) => {
		e.stopPropagation();
	};

	const handleClick = ( e ) => {
		const target = e.target;
		const isEditSection = target.closest( '.mw-editsection, .mw-editsection-like' );

		if ( isEditSection ) {
			onEditSectionClick( e );
			return;
		}

		const selectedHeading = target.closest( '.citizen-section-heading' );

		if ( selectedHeading ) {
			const selectedHeadline = selectedHeading.querySelector( '.mw-headline, .mw-heading' );

			if ( selectedHeadline ) {
				const sectionIndex = +selectedHeadline.dataset.mwCitizenSectionHeadingIndex;
				const selectedSection = sections[ sectionIndex + 1 ];
				toggleClasses( selectedHeading, selectedSection );
				toggleAriaAttribute( selectedHeadline, 'aria-expanded' );
				toggleAriaAttribute( selectedSection, 'aria-hidden' );
			}
		}
	};

	const simulateClickOnHeadings = () => {
		headings.forEach((heading) => {
			const event = new Event('click', { bubbles: true, cancelable: true });
			heading.dispatchEvent(event);
		});
	};
	const simulateClickOnCollapsedHeadings = () => {
		headings.forEach((heading) => {
			if (heading.classList.contains('citizen-section-heading--collapsed')) {
				const event = new Event('click', { bubbles: true, cancelable: true });
				heading.dispatchEvent(event);
			}
		});
	};
	// Simulate clicks on collapsed headings if the screen width is less than 1120 pixels and a hash is present in the URL
    const handleHashChange = () => {
        if (window.location.hash) {
            simulateClickOnCollapsedHeadings();
            
            // Move the page to the anchor point
            const anchor = document.querySelector(window.location.hash);
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
	// Listen for hash change events
	window.addEventListener('hashchange', handleHashChange);
	const headingsLength = headings.length;
	for ( let i = 0; i < headingsLength; i++ ) {
		setHeadlineAttributes( headings[ i ], `citizen-section-${ i + 1 }`, i );
	}

	sections.forEach( ( section ) => {
		setSectionAttributes( section );
	} );

	bodyContent.addEventListener( 'click', handleClick, false );

	// Simulate clicks on all headings if the screen width is less than 1120 pixels and no anchor is present in the URL
	if (window.innerWidth < 1120 && !window.location.hash) {
		simulateClickOnHeadings();
	}
}

module.exports = {
	init: init
};