<?php

/**
 * @file
 * Fichier contenant l'administration de l'age gate.
 *
 */

/**
 * Admin settings form.
 *
 * @param array $form
 *   Table of form.
 * @param array $form_state
 *   Table data of form
 * @param bool|FALSE $no_js_use
 * @return mixed
 */

function agegate_settings_form($form, &$form_state)
{
    //Récuperation des valeurs par défaut
   $default = variable_get('pr_lp_ag_vars');

    if (isset($default)) {
        $common = $default['common'];
        $lp = $default['lp'];
        $ag = $default['ag'];
    }

    /*** la configuration commune ***/
    $form['common'] = array(
        '#type' => 'fieldset',
        '#collapsible' => TRUE,
        '#title' => t('Configurations generales de la landing page et de l\'Age gate'),
    );

    // Stockage des fichiers
    $stream_wrappers = file_get_stream_wrappers(STREAM_WRAPPERS_WRITE_VISIBLE);
    $stream_options = array();
    foreach ($stream_wrappers as $stream => $wrapper) {
        $stream_options[$stream] = $wrapper['name'] . ' - ' . $wrapper['description'];
    }

    $form['common']['stockage'] = array(
        '#type' => 'select',
        '#required' => TRUE,
        '#options' => $stream_options,
        '#title' => t('Choisir le type de stockage'),
        '#default_value' => isset($common['stockage']) ? $common['stockage'] : 's3',
    );

    // Logo
    $uri = '';
    if (isset($common['stockage'])) {
        $uri = $common['stockage'] . '://age_gate';

        $file = file_prepare_directory($uri);
        if (!$file) {
            $create_dir = drupal_mkdir($uri, NULL, TRUE);
            if ($create_dir == FALSE) {
                drupal_set_message(t('Impossible de créer le repertoires des fichiers.'), 'error');
            }
        }
    }
    else {
        $uri = 's3://age_gate';
    }

    $form['common']['logo'] = array(
        '#type' => 'managed_file',
        '#title' => t('Logo'),
        '#description' => t('Le logo à utiliser sur la LP'),
        //'#required' => TRUE,
        '#upload_location' => $uri,
        '#upload_validators' => array(
            'file_validate_extensions' => array('gif jpg jpeg png svg'),
        ),
        '#default_value' => isset($common['logo']) ? $common['logo'] : 0,
    );

    // Background Image

    $form['common']['image'] = array(
        '#type' => 'managed_file',
        '#title' => t('Image du background'),
        '#description' => t('Image à utiliser pour le background du block landing page'),
        '#upload_location' => $uri,
        '#upload_validators' => array(
            'file_validate_extensions' => array('gif jpg jpeg png'),
        ),
        '#default_value' => isset($common['image']) ? $common['image'] : 0,
    );

    // Background Video
    $form['common']['video'] = array(
        '#type' => 'managed_file',
        '#title' => t('Video du background'),
        '#description' => t('Video à utiliser pour le background du block landing page'),
        '#upload_location' => $uri,
        '#upload_validators' => array(
            'file_validate_extensions' => array('mp4 webm ogg mpeg avi'),
        ),
        '#default_value' => $common['video'] ? $common['video'] : '',
    );

    $form['common']['texte_sanitaire'] = array(
        '#title' => t('Le Texte sanitaire'),
        '#type' => 'textfield',
        '#description' => t('Le texte sanitaire. S\'affiche en bas du block'),
        '#required' => TRUE,
        '#default_value' => $common['texte_sanitaire'] ? $common['texte_sanitaire'] : t('L\'ABUS D\'ALCOOL EST DANGEREUX POUR LA SANTÉ. A CONSOMMER AVEC MODÉRATION'),
    );

    // Cookie life time.
    $form['common']['cookie_lifetime'] = array(
        '#type' => 'textfield',
        '#element_validate' => array('element_validate_integer'),
        '#title' => t('Cookies life time'),
        '#default_value' => isset($common['cookie_lifetime']) ? $common['cookie_lifetime'] : 31536000,
    );

    /*** Personnalisation de la landing page ***/
    // le container Personnalisation
    $form['landing_page'] = array(
        '#type' => 'fieldset',
        '#collapsible' => TRUE,
        '#title' => t('Personnalisation de la landing page'),
    );

    $form['landing_page']['lp_disable'] = array(
        '#type' => 'checkbox',
        '#title' => t('Désactiver l\'utilisation de la Landing page'),
        '#default_value' => isset($lp['lp_disable']) ? $lp['lp_disable'] : 0,
    );

    $form['landing_page']['welcome_text'] = array(
        '#title' => t('Titre de la LP '),
        '#type' => 'textfield',
        '#description' => t('Le message de bienvenue de la LP'),
        '#required' => TRUE,
        '#default_value' => isset($lp['welcome_text']) ? $lp['welcome_text'] : t('Bienvenue chez nous !'),
    );

    $form['landing_page']['entete_menu'] = array(
        '#title' => t('Entête du block des liens'),
        '#type' => 'textfield',
        '#description' => t('Le texte de l\'entête menu. S\'affiche en dessus des liens de la LP'),
        '#required' => TRUE,
        '#default_value' => $lp['entete_menu'] ? $lp['entete_menu'] : t('Que peut-on vous servir ?'),
    );

    // le formulaire de recherche
    $form['landing_page']['search'] = array(
        '#type' => 'fieldset',
        '#collapsible' => TRUE,
        '#title' => t('Formulaire de recherche'),
    );

    $form['landing_page']['search']['disable_search'] = array(
        '#type' => 'checkbox',
        '#title' => t('Cacher le champ de recherche sur la LP'),
        '#default_value' => isset($lp['disable_search']) ? $lp['disable_search'] : 0,
    );

    $form['landing_page']['search']['placeholder'] = array(
        '#title' => t('Placeholder du champ de recherche'),
        '#type' => 'textfield',
        '#description' => t('Le Placeholder du champ texte de recherche'),
        '#default_value' => $lp['placeholder'] ? $lp['placeholder'] : t('Tapez votre mot clé ou votre question'),
    );

    /*** Personnalisation de l'age gate ***/
    // description du bloc Age gate
    $form['agegate'] = array(
        '#type' => 'fieldset',
        '#collapsible' => TRUE,
        '#title' => t('Configuration de l\'age Gate'),
    );

    $form['agegate']['ag_disable'] = array(
        '#type' => 'checkbox',
        '#title' => t('Désactiver l\'age gate sur tout le site'),
        '#default_value' => isset($ag['ag_disable']) ? $ag['ag_disable'] : 0,
    );

    // List of path wich can be considered as an URL profonde.
    $form['agegate']['ag_pages'] = array(
        '#type' => 'textarea',
        '#title' => t('les pages pour lesquelles activer l\'Age Gate'),
        '#description' => t('Chemins des pages sur lesquelles sera activé l\'Age Gate. Un chemin par ligne.'),
        '#default_value' => isset($ag['ag_pages']) ? $ag['ag_pages'] : '',
    );

    $form['agegate']['description'] = array(
        '#type' => 'textarea',
        '#title' => t('Description du formulaire AG.'),
        '#description' => t('Le texte du bloc Age Gate. S\'affiche en dessus du formulaire AG'),
        '#default_value' => $ag['description'] ? $ag['description'] : "" ,
    );

    $form['#submit'][]='agegate_settings_form_submit';

    return system_settings_form($form);
}


function agegate_settings_form_submit($form, &$form_state) {

    $default = variable_get('pr_lp_ag_vars');

    //common
    $values['common']['stockage']=$form_state['values']['stockage'];
    $values['common']['image']=$form_state['values']['image'];
    $values['common']['video']=$form_state['values']['video'];
    $values['common']['texte_sanitaire']=$form_state['values']['texte_sanitaire'];
    $values['common']['logo']=$form_state['values']['logo'];
    $values['common']['cookie_lifetime']=$form_state['values']['cookie_lifetime'];

    //landing_page
    $values['lp']['lp_disable']=$form_state['values']['lp_disable'];
    $values['lp']['welcome_text']=$form_state['values']['welcome_text'];
    $values['lp']['entete_menu']=$form_state['values']['entete_menu'];
    $values['lp']['placeholder']=$form_state['values']['placeholder'];
    $values['lp']['disable_search']=$form_state['values']['disable_search'];

    //age gate
    $values['ag']['ag_disable']=$form_state['values']['ag_disable'];
    $values['ag']['description']=$form_state['values']['description'];
    $values['ag']['ag_pages']=$form_state['values']['ag_pages'];

    pr_agegate_save_file($values['common']['logo'],$default['common']['logo']);
    pr_agegate_save_file($values['common']['image'],$default['common']['image']);
    pr_agegate_save_file($values['common']['video'],$default['common']['video']);

    variable_set('pr_lp_ag_vars', $values);
}

function pr_agegate_save_file($image, $old_image){

        if (!empty($image) && $image != 0) {
            $file = file_load($image);
            if ($file) {
                $file->status = FILE_STATUS_PERMANENT;
                file_save($file);
                file_usage_add($file, 'pr_hub_landing_page', 'pr_hub_landing_page_image', 1);
            }
            else {
                drupal_set_message(t("Impossible d'enregistrer le fichier"), 'error');
            }
        }
        // Supprimer l'ancien fichier
        if (!empty($old_image) && $old_image != 0) {
            // Retrieve the old file's id.
            $file = file_load($old_image);
            if ($file) {
                file_usage_delete($file, 'pr_hub_landing_page', 'pr_hub_landing_page_image', 1);
                file_delete($file);
            }
        }

}